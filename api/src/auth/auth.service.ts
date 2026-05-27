import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { Role } from '@prisma/client';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: Role;
  universityId?: string;
  department?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  twoFactorCode?: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private mapDepartment(dept?: string): any {
    if (!dept) return null;
    const d = dept.toLowerCase().trim();
    if (d.includes('computer') || d.includes('science') || d.includes('cse') || d.includes('software')) return 'CSE';
    if (d.includes('information') || d.includes('it') || d.includes('tech')) return 'IT';
    if (d.includes('intelligence') || d.includes('data') || d.includes('ai') || d.includes('ds')) return 'AI_DS';
    if (d.includes('mechanic') || d.includes('me')) return 'MECHANICAL';
    if (d.includes('civil')) return 'CIVIL';
    if (d.includes('ece') || d.includes('electronic') || d.includes('telecom')) return 'ECE';
    if (d.includes('eee') || d.includes('electrical')) return 'EEE';
    if (d.includes('mba') || d.includes('management') || d.includes('business')) return 'MBA';
    if (d.includes('commerce') || d.includes('finance') || d.includes('account')) return 'COMMERCE';
    if (d.includes('pharmacy') || d.includes('pharm')) return 'PHARMACY';
    if (d.includes('medical') || d.includes('doctor') || d.includes('nurs') || d.includes('health')) return 'MEDICAL';
    if (d.includes('law') || d.includes('legal')) return 'LAW';
    if (d.includes('design') || d.includes('art') || d.includes('ui') || d.includes('ux') || d.includes('fash')) return 'DESIGN';
    if (d.includes('agri') || d.includes('farm')) return 'AGRICULTURE';
    return 'CSE';
  }

  private generateTokens(userId: string, email: string, role: string, sessionId?: string) {
    const payload = { sub: userId, email, role, sessionId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_REFRESH_SECRET', this.config.get('JWT_SECRET') + '_refresh'),
    });
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role,
        universityId: dto.universityId || null,
        department: this.mapDepartment(dto.department) || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Initialize TrustScore
    await this.prisma.trustScore.create({
      data: { userId: user.id },
    });

    const { accessToken, refreshToken } = this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      accessToken,
      refreshToken,
      message: 'Registration successful',
    };
  }

  async login(dto: LoginDto, req?: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated. Contact support.');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2FA check
    if (user.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        return {
          requiresTwoFactor: true,
          message: '2FA code required',
        };
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: dto.twoFactorCode,
        window: 2,
      });

      if (!verified) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        token: this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' }),
        deviceInfo: dto.deviceInfo || null,
        ipAddress: dto.ipAddress || req?.ip || null,
        userAgent: dto.userAgent || req?.get?.('User-Agent') || null,
        expiresAt,
      },
    });

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      user.role,
      session.id,
    );

    // Update session token with actual JWT
    await this.prisma.session.update({
      where: { id: session.id },
      data: { token: accessToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        twoFactorEnabled: user.twoFactorEnabled,
        isVerified: user.isVerified,
        subscriptionPlan: user.subscriptionPlan,
      },
      accessToken,
      refreshToken,
      sessionId: session.id,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET', this.config.get('JWT_SECRET') + '_refresh'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const { accessToken, refreshToken } = this.generateTokens(
        user.id,
        user.email,
        user.role,
        payload.sessionId,
      );

      return { accessToken, refreshToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async enable2FA(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const secret = speakeasy.generateSecret({
      name: `ResumeVerify X (${user.email})`,
      length: 32,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      message: 'Scan this QR code with your authenticator app',
    };
  }

  async verify2FA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA setup not initiated');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!verified) {
      throw new BadRequestException('Invalid 2FA code. Please try again.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { message: '2FA enabled successfully', twoFactorEnabled: true };
  }

  async revokeAllSessions(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    return { message: 'All sessions revoked successfully' };
  }

  async getActiveSessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { sessions };
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    return { message: 'Session revoked successfully' };
  }
}
