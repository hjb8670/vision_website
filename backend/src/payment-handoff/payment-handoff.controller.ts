import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { PaymentHandoffService } from './payment-handoff.service';
import { RedeemHandoffDto } from './dto/redeem-handoff.dto';

@Controller('payment-handoff')
export class PaymentHandoffController {
  constructor(private paymentHandoffService: PaymentHandoffService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: AuthUser) {
    return this.paymentHandoffService.create(user.userId);
  }

  @Post('redeem')
  redeem(@Body() dto: RedeemHandoffDto) {
    return this.paymentHandoffService.redeem(dto.token);
  }
}
