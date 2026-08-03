import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  providers: [WalletService],
  controllers: [WalletController, StripeWebhookController],
  exports: [WalletService],
})
export class WalletModule {}
