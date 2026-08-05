import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { CommentsService } from './comments.service';
import { MarketsController } from './markets.controller';

@Module({
  providers: [MarketsService, CommentsService],
  controllers: [MarketsController],
  exports: [MarketsService],
})
export class MarketsModule {}
