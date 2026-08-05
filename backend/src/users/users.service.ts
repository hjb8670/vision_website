import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';

const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Accepts either a user id (uuid) or a username — the mobile app calls this with an id, the website with a username. */
  async findByIdOrUsername(idOrUsername: string) {
    const user = await this.prisma.user.findUnique({
      where: isUuid(idOrUsername) ? { id: idOrUsername } : { username: idOrUsername },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        bio: true,
        avatarUrl: true,
        referralCode: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          username: dto.username,
          bio: dto.bio,
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new ConflictException('Username is already taken');
      }
      throw err;
    }
  }

  async getSecurity(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return { two_factor_enabled: user.twoFactorEnabled };
  }

  async enable2fa(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    return { two_factor_enabled: true };
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const target = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!target) throw new NotFoundException('User not found');

    return this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });
  }

  async getFollowers(userId: string) {
    const rows = await this.prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: { select: PUBLIC_USER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => r.follower);
  }

  async getFollowing(userId: string) {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: PUBLIC_USER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => r.following);
  }

  async block(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      throw new BadRequestException('Cannot block yourself');
    }
    const target = await this.prisma.user.findUnique({ where: { id: blockedId } });
    if (!target) throw new NotFoundException('User not found');

    return this.prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      create: { blockerId, blockedId },
      update: {},
    });
  }

  async getReferralInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, referredById: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const referredCount = await this.prisma.user.count({ where: { referredById: userId } });
    return {
      code: user.referralCode,
      already_redeemed: !!user.referredById,
      referred_count: referredCount,
    };
  }

  async redeemReferralCode(userId: string, code: string) {
    const normalized = code.trim().toUpperCase();

    const [me, referrer] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.user.findUnique({ where: { referralCode: normalized } }),
    ]);
    if (!me) throw new NotFoundException('User not found');
    if (me.referredById) {
      throw new BadRequestException('You have already redeemed a referral code');
    }
    if (!referrer) {
      throw new BadRequestException('Invalid referral code');
    }
    if (referrer.id === userId) {
      throw new BadRequestException('You cannot redeem your own referral code');
    }

    const BONUS = 10;
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { referredById: referrer.id },
      }),
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: BONUS } },
      }),
      this.prisma.wallet.update({
        where: { userId: referrer.id },
        data: { balance: { increment: BONUS } },
      }),
      this.prisma.walletLedger.create({
        data: {
          wallet: { connect: { userId } },
          amount: BONUS,
          type: 'BONUS',
          note: `Referral bonus for joining via @${referrer.username}`,
        },
      }),
      this.prisma.walletLedger.create({
        data: {
          wallet: { connect: { userId: referrer.id } },
          amount: BONUS,
          type: 'BONUS',
          note: `Referral bonus — @${me.username} joined using your code`,
        },
      }),
    ]);

    return { bonus: BONUS, referrer_username: referrer.username };
  }

  async findAllAdmin(search?: string) {
    const users = await this.prisma.user.findMany({
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { username: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        wallet: { select: { balance: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt,
      walletBalance: u.wallet?.balance ?? null,
    }));
  }
}
