import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { WalletService } from './wallet.service';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance')
  balance(@CurrentUser() user: AuthUser) {
    return this.walletService.getBalance(user.userId);
  }

  @Get('transactions')
  transactions(@CurrentUser() user: AuthUser, @Query('limit') limit?: string) {
    return this.walletService.getTransactions(
      user.userId,
      limit ? Number(limit) : undefined,
    );
  }
}
