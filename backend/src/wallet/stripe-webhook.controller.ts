import { Controller, Headers, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import Stripe from 'stripe';
import { WalletService } from './wallet.service';

@Controller('wallet/webhooks')
export class StripeWebhookController {
  constructor(private walletService: WalletService) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.walletService.constructStripeEvent(req.rawBody, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const amountTotal = session.amount_total;
      if (userId && amountTotal) {
        await this.walletService.creditDeposit(userId, amountTotal / 100);
      }
    }

    return { received: true };
  }
}
