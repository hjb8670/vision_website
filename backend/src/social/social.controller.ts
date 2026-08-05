import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { SocialService } from './social.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Get('feed')
  feed() {
    return this.socialService.getFeed();
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  createPost(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.socialService.createPost(user.userId, dto);
  }
}
