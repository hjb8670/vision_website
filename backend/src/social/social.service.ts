import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

const POST_AUTHOR_SELECT = { id: true, username: true, avatarUrl: true };

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async getFeed() {
    return this.prisma.post.findMany({
      include: { user: { select: POST_AUTHOR_SELECT } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
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
}
