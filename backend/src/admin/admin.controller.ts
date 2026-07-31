import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { MarketsService } from '../markets/markets.service';
import { CreateMarketDto } from '../markets/dto/create-market.dto';
import { UpdateMarketDto } from '../markets/dto/update-market.dto';
import { ResolveMarketDto } from '../markets/dto/resolve-market.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/markets')
export class AdminController {
  constructor(private marketsService: MarketsService) {}

  @Post()
  create(@Body() dto: CreateMarketDto) {
    return this.marketsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMarketDto) {
    return this.marketsService.update(id, dto);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string, @Body() dto: ResolveMarketDto) {
    return this.marketsService.resolve(id, dto.outcome);
  }
}
