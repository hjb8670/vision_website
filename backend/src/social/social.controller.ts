import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { SocialService } from './social.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('feed')
  feed(@CurrentUser() user?: AuthUser) {
    return this.socialService.getFeed(user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  createPost(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.socialService.createPost(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts/:id/like')
  toggleLike(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.socialService.toggleLike(user.userId, id);
  }

  @Get('posts/:id/comments')
  getComments(@Param('id') id: string) {
    return this.socialService.getComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts/:id/comments')
  createComment(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreatePostCommentDto,
  ) {
    return this.socialService.createComment(user.userId, id, dto);
  }
}
