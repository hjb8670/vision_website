import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

const TOKEN_TTL_MS = 2 * 60 * 1000;

@Injectable()
export class PaymentHandoffService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(userId: string) {
    const token = crypto.randomBytes(24).toString('hex');
    await this.prisma.paymentHandoffToken.create({
      data: {
        token,
        userId,
        purpose: 'deposit',
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });
    return { token };
  }

  async redeem(token: string) {
    const record = await this.prisma.paymentHandoffToken.findUnique({
      where: { token },
    });
    if (!record) throw new NotFoundException('Invalid handoff token');
    if (record.consumedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Handoff token expired or already used');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: record.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.paymentHandoffToken.update({
      where: { token },
      data: { consumedAt: new Date() },
    });

    return {
      accessToken: this.authService.sign(user),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
