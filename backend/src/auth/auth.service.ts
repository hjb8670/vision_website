import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthProvider, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { verifyFirebaseIdToken } from './firebase-admin';
import { verifyAppleIdentityToken } from './apple-jwt';

const STARTING_BALANCE = 1000;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

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

  private async createUserWithWallet(data: {
    email: string;
    username: string;
    passwordHash: string | null;
    authProvider: AuthProvider;
    providerId?: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        authProvider: data.authProvider,
        providerId: data.providerId,
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
}
