import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { PositionsService } from './positions.service';

@UseGuards(JwtAuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Get()
  findForUser(@CurrentUser() user: AuthUser) {
    return this.positionsService.findForUser(user.userId);
  }
}
