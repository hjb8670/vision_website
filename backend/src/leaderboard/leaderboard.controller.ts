import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  findAll() {
    return this.leaderboardService.findAll();
  }

  @Get('biggest-wins')
  biggestWins(@Query('limit') limit?: string) {
    return this.leaderboardService.biggestWins(
      limit ? Number(limit) : undefined,
    );
  }
}
