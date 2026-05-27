import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
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
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    private mapDepartment;
    private generateTokens;
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    login(dto: LoginDto, req?: any): Promise<{
        requiresTwoFactor: boolean;
        message: string;
        user?: undefined;
        accessToken?: undefined;
        refreshToken?: undefined;
        sessionId?: undefined;
    } | {
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            avatarUrl: string | null;
            twoFactorEnabled: boolean;
            isVerified: boolean;
            subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        };
        accessToken: string;
        refreshToken: string;
        sessionId: string;
        requiresTwoFactor?: undefined;
        message?: undefined;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    enable2FA(userId: string): Promise<{
        secret: string;
        qrCode: string;
        message: string;
    }>;
    verify2FA(userId: string, code: string): Promise<{
        message: string;
        twoFactorEnabled: boolean;
    }>;
    revokeAllSessions(userId: string): Promise<{
        message: string;
    }>;
    getActiveSessions(userId: string): Promise<{
        sessions: {
            id: string;
            createdAt: Date;
            deviceInfo: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            expiresAt: Date;
        }[];
    }>;
    revokeSession(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
}
