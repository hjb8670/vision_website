import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaymentHandoffService } from './payment-handoff.service';
import { PaymentHandoffController } from './payment-handoff.controller';

@Module({
  imports: [AuthModule],
  providers: [PaymentHandoffService],
  controllers: [PaymentHandoffController],
})
export class PaymentHandoffModule {}
