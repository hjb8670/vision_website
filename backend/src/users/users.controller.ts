import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.me(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/security')
  security(@CurrentUser() user: AuthUser) {
    return this.usersService.getSecurity(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/security/2fa/enable')
  enable2fa(@CurrentUser() user: AuthUser) {
    return this.usersService.enable2fa(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  follow(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.usersService.follow(user.userId, id);
  }

  @Get(':id/followers')
  followers(@Param('id') id: string) {
    return this.usersService.getFollowers(id);
  }

  @Get(':id/following')
  following(@Param('id') id: string) {
    return this.usersService.getFollowing(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/block')
  block(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.usersService.block(user.userId, id);
  }

  @Get(':idOrUsername')
  byIdOrUsername(@Param('idOrUsername') idOrUsername: string) {
    return this.usersService.findByIdOrUsername(idOrUsername);
  }
}
