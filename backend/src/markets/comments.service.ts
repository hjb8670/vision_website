import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  /** Accepts either a market id (uuid) or a slug — mobile call sites pass whichever they already have on hand. */
  async createComment(idOrSlug: string, userId: string, dto: CreateCommentDto) {
    const market = await this.prisma.market.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      select: { id: true },
    });
    if (!market) throw new NotFoundException('Market not found');

    return this.prisma.comment.create({
      data: {
        marketId: market.id,
        userId,
        text: dto.text,
      },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }
}
