import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MarketsModule } from '../markets/markets.module';

@Module({
  imports: [MarketsModule],
  controllers: [AdminController],
})
export class AdminModule {}
