import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Resend } from 'resend';
import { AuthProvider, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { verifyFirebaseIdToken } from './firebase-admin';
import { verifyAppleIdentityToken } from './apple-jwt';

const STARTING_BALANCE = 1000;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

@Injectable()
export class AuthService {
  private resendClient: Resend | null = null;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /** Lazy so a missing RESEND_API_KEY only breaks the forgot-password endpoint, not app boot. */
  private get resend(): Resend {
    if (!this.resendClient) {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new InternalServerErrorException('Email is not configured on the server');
      }
      this.resendClient = new Resend(apiKey);
    }
    return this.resendClient;
  }

  sign(user: { id: string; email: string; role: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }

  private sanitize(user: {
    id: string;
    email: string;
    username: string;
    role: string;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private async generateUniqueUsername(email: string) {
    const base = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') || 'user';
    let candidate = base;
    let suffix = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.prisma.user.findUnique({
        where: { username: candidate },
      });
      if (!existing) return candidate;
      suffix += 1;
      candidate = `${base}${suffix}`;
    }
  }

  private async generateUniqueReferralCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid ambiguity
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      const existing = await this.prisma.user.findUnique({ where: { referralCode: code } });
      if (!existing) return code;
    }
  }

  private async createUserWithWallet(data: {
    email: string;
    username: string;
    passwordHash: string | null;
    authProvider: AuthProvider;
    providerId?: string;
  }): Promise<User> {
    const referralCode = await this.generateUniqueReferralCode();
    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        authProvider: data.authProvider,
        providerId: data.providerId,
        referralCode,
        wallet: {
          create: {
            balance: STARTING_BALANCE,
            ledger: {
              create: {
                amount: STARTING_BALANCE,
                type: 'SEED',
                note: 'Starting virtual balance',
              },
            },
          },
        },
      },
    });
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException('Email or username already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.createUserWithWallet({
      email: dto.email,
      username: dto.username,
      passwordHash,
      authProvider: AuthProvider.EMAIL,
    });

    return { accessToken: this.sign(user), user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return { accessToken: this.sign(user), user: this.sanitize(user) };
  }

  private async loginOrCreateOAuthUser(params: {
    email: string;
    providerId: string;
    authProvider: AuthProvider;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: params.email },
    });

    if (!user) {
      const username = await this.generateUniqueUsername(params.email);
      user = await this.createUserWithWallet({
        email: params.email,
        username,
        passwordHash: null,
        authProvider: params.authProvider,
        providerId: params.providerId,
      });
    } else if (!user.providerId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { authProvider: params.authProvider, providerId: params.providerId },
      });
    }

    return { accessToken: this.sign(user), user: this.sanitize(user) };
  }

  async loginWithGoogle(idToken: string) {
    const decoded = await verifyFirebaseIdToken(idToken);
    if (!decoded.email) {
      throw new UnauthorizedException('Google account has no email');
    }
    return this.loginOrCreateOAuthUser({
      email: decoded.email,
      providerId: decoded.uid,
      authProvider: AuthProvider.GOOGLE,
    });
  }

  async loginWithApple(identityToken: string) {
    const payload = await verifyAppleIdentityToken(identityToken);
    if (!payload.email) {
      throw new UnauthorizedException(
        'No email returned by Apple — sign in with another method',
      );
    }
    return this.loginOrCreateOAuthUser({
      email: payload.email,
      providerId: payload.sub,
      authProvider: AuthProvider.APPLE,
    });
  }

  /** Always returns a generic success shape, even for unknown emails, to avoid account enumeration. */
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'If that email is registered, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(24).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://visionprediction.com';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Vision <no-reply@visionprediction.com>';

    await this.resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: 'Reset your Vision password',
      html: `<p>We received a request to reset your password. This link expires in 30 minutes.</p><p><a href="${resetUrl}">Reset your password</a></p><p>If you didn't request this, you can ignore this email.</p>`,
    });

    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });
    if (!record) throw new BadRequestException('Invalid or expired reset token');
    if (record.consumedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.new_password, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { token: dto.token },
        data: { consumedAt: new Date() },
      }),
    ]);

    return { message: 'Password has been reset' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    if (!user.passwordHash) {
      throw new BadRequestException(
        `This account signed in with ${user.authProvider.toLowerCase()} and has no password to change`,
      );
    }

    const valid = await bcrypt.compare(dto.current_password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.new_password, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed' };
  }
}
