import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

const POST_AUTHOR_SELECT = { id: true, username: true, avatarUrl: true };

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async getFeed(userId?: string) {
    const posts = await this.prisma.post.findMany({
      include: {
        user: { select: POST_AUTHOR_SELECT },
        _count: { select: { likes: true, postComments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const likedPostIds = userId
      ? new Set(
          (
            await this.prisma.like.findMany({
              where: { userId, postId: { in: posts.map((p) => p.id) } },
              select: { postId: true },
            })
          ).map((l) => l.postId),
        )
      : new Set<string>();

    return posts.map(({ _count, ...post }) => ({
      ...post,
      likesCount: _count.likes,
      commentsCount: _count.postComments,
      likedByMe: likedPostIds.has(post.id),
    }));
  }

  async createPost(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        userId,
        text: dto.text,
        sentiment: dto.sentiment,
        tags: dto.tags ?? [],
        images: dto.images ?? [],
      },
      include: { user: { select: POST_AUTHOR_SELECT } },
    });
  }

  async toggleLike(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.like.create({ data: { userId, postId } });
    }

    const likesCount = await this.prisma.like.count({ where: { postId } });
    return { liked: !existing, likesCount };
  }

  async getComments(postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.postComment.findMany({
      where: { postId },
      include: { user: { select: POST_AUTHOR_SELECT } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createComment(userId: string, postId: string, dto: CreatePostCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.postComment.create({
      data: { userId, postId, text: dto.text },
      include: { user: { select: POST_AUTHOR_SELECT } },
    });
  }
}
