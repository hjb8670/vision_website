import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  MarketsService,
  type SortFilter,
  type HistoryRange,
} from './markets.service';

@Controller('markets')
export class MarketsController {
  constructor(private marketsService: MarketsService) {}

  @Get()
  findAll(@Query('sf') sf?: SortFilter, @Query('category') category?: string) {
    return this.marketsService.findAll(sf ?? 'newest', category);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.marketsService.findBySlug(slug);
  }

  @Get(':id/history')
  history(@Param('id') id: string, @Query('range') range?: HistoryRange) {
    return this.marketsService.history(id, range ?? 'ALL');
  }
}
