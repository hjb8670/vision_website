import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  MarketsService,
  type SortFilter,
  type HistoryRange,
} from './markets.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('markets')
export class MarketsController {
  constructor(
    private marketsService: MarketsService,
    private commentsService: CommentsService,
  ) {}

  @Get()
  findAll(@Query('sf') sf?: SortFilter, @Query('category') category?: string) {
    return this.marketsService.findAll(sf ?? 'newest', category);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.marketsService.findBySlug(slug);
  }

  @Get(':id/history')
  history(@Param('id') id: string, @Query('range') range?: HistoryRange) {
    return this.marketsService.history(id, range ?? 'ALL');
  }

  @UseGuards(JwtAuthGuard)
  @Post(':idOrSlug/comments')
  createComment(
    @CurrentUser() user: AuthUser,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(idOrSlug, user.userId, dto);
  }
}
