import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { CategoriesModule } from './categories/categories.module';
import { MarketsModule } from './markets/markets.module';
import { OrdersModule } from './orders/orders.module';
import { PositionsModule } from './positions/positions.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';
import { PaymentHandoffModule } from './payment-handoff/payment-handoff.module';
import { SocialModule } from './social/social.module';
import { ReportsModule } from './reports/reports.module';
import { SupportModule } from './support/support.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WalletModule,
    CategoriesModule,
    MarketsModule,
    OrdersModule,
    PositionsModule,
    LeaderboardModule,
    AdminModule,
    PaymentHandoffModule,
    SocialModule,
    ReportsModule,
    SupportModule,
    NotificationsModule,
  ],
})
export class AppModule {}
