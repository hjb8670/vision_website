import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminCategoriesController } from './admin-categories.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminStatsController } from './admin-stats.controller';
import { AdminService } from './admin.service';
import { MarketsModule } from '../markets/markets.module';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MarketsModule, CategoriesModule, UsersModule],
  controllers: [
    AdminController,
    AdminCategoriesController,
    AdminUsersController,
    AdminStatsController,
  ],
  providers: [AdminService],
})
export class AdminModule {}
