"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const speakeasy = __importStar(require("speakeasy"));
const QRCode = __importStar(require("qrcode"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    mapDepartment(dept) {
        if (!dept)
            return null;
        const d = dept.toLowerCase().trim();
        if (d.includes('computer') || d.includes('science') || d.includes('cse') || d.includes('software'))
            return 'CSE';
        if (d.includes('information') || d.includes('it') || d.includes('tech'))
            return 'IT';
        if (d.includes('intelligence') || d.includes('data') || d.includes('ai') || d.includes('ds'))
            return 'AI_DS';
        if (d.includes('mechanic') || d.includes('me'))
            return 'MECHANICAL';
        if (d.includes('civil'))
            return 'CIVIL';
        if (d.includes('ece') || d.includes('electronic') || d.includes('telecom'))
            return 'ECE';
        if (d.includes('eee') || d.includes('electrical'))
            return 'EEE';
        if (d.includes('mba') || d.includes('management') || d.includes('business'))
            return 'MBA';
        if (d.includes('commerce') || d.includes('finance') || d.includes('account'))
            return 'COMMERCE';
        if (d.includes('pharmacy') || d.includes('pharm'))
            return 'PHARMACY';
        if (d.includes('medical') || d.includes('doctor') || d.includes('nurs') || d.includes('health'))
            return 'MEDICAL';
        if (d.includes('law') || d.includes('legal'))
            return 'LAW';
        if (d.includes('design') || d.includes('art') || d.includes('ui') || d.includes('ux') || d.includes('fash'))
            return 'DESIGN';
        if (d.includes('agri') || d.includes('farm'))
            return 'AGRICULTURE';
        return 'CSE';
    }
    generateTokens(userId, email, role, sessionId) {
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
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists');
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
    async login(dto, req) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account has been deactivated. Contact support.');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.twoFactorEnabled) {
            if (!dto.twoFactorCode) {
                return {
                    requiresTwoFactor: true,
                    message: '2FA code required',
                };
            }
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: dto.twoFactorCode,
                window: 2,
            });
            if (!verified) {
                throw new common_1.UnauthorizedException('Invalid 2FA code');
            }
        }
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
        const { accessToken, refreshToken } = this.generateTokens(user.id, user.email, user.role, session.id);
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
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.config.get('JWT_REFRESH_SECRET', this.config.get('JWT_SECRET') + '_refresh'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, role: true, isActive: true },
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            const { accessToken, refreshToken } = this.generateTokens(user.id, user.email, user.role, payload.sessionId);
            return { accessToken, refreshToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async enable2FA(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const secret = speakeasy.generateSecret({
            name: `ResumeVerify X (${user.email})`,
            length: 32,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 },
        });
        const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
        return {
            secret: secret.base32,
            qrCode: qrCodeDataUrl,
            message: 'Scan this QR code with your authenticator app',
        };
    }
    async verify2FA(userId, code) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('2FA setup not initiated');
        }
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 2,
        });
        if (!verified) {
            throw new common_1.BadRequestException('Invalid 2FA code. Please try again.');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
        return { message: '2FA enabled successfully', twoFactorEnabled: true };
    }
    async revokeAllSessions(userId) {
        await this.prisma.session.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
        });
        return { message: 'All sessions revoked successfully' };
    }
    async getActiveSessions(userId) {
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
    async revokeSession(userId, sessionId) {
        const session = await this.prisma.session.findFirst({
            where: { id: sessionId, userId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { isActive: false },
        });
        return { message: 'Session revoked successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map