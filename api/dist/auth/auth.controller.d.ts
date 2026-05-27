import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import type { Request } from 'express';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: Role;
    universityId?: string;
    department?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    twoFactorCode?: string;
    deviceInfo?: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class Verify2FADto {
    code: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(dto: LoginDto, req: Request): Promise<{
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
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    enable2FA(userId: string): Promise<{
        secret: string;
        qrCode: string;
        message: string;
    }>;
    verify2FA(userId: string, dto: Verify2FADto): Promise<{
        message: string;
        twoFactorEnabled: boolean;
    }>;
    getSessions(userId: string): Promise<{
        sessions: {
            id: string;
            createdAt: Date;
            deviceInfo: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            expiresAt: Date;
        }[];
    }>;
    revokeAllSessions(userId: string): Promise<{
        message: string;
    }>;
    revokeSession(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
}
