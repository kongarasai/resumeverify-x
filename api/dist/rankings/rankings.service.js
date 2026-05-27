"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RankingsService = class RankingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUniversityLeaderboard(universityId) {
        return this.prisma.ranking.findMany({
            where: { user: { universityId } },
            include: { user: { select: { id: true, name: true, avatarUrl: true, department: true } } },
            orderBy: { xp: 'desc' },
            take: 100,
        });
    }
    async getCodingLeaderboard(universityId) {
        return this.prisma.ranking.findMany({
            where: universityId ? { user: { universityId } } : {},
            include: { user: { select: { id: true, name: true, avatarUrl: true, leetcodeUsername: true } } },
            orderBy: { codingRank: 'asc' },
            take: 100,
        });
    }
    async getDepartmentLeaderboard(universityId, department) {
        return this.prisma.ranking.findMany({
            where: { user: { universityId, department: department } },
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { xp: 'desc' },
            take: 50,
        });
    }
    async getUserRanking(userId) {
        return this.prisma.ranking.findFirst({
            where: { userId },
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        });
    }
    async updateRanking(userId, xpDelta, badge) {
        const existing = await this.prisma.ranking.findFirst({ where: { userId } });
        if (existing) {
            return this.prisma.ranking.update({
                where: { id: existing.id },
                data: {
                    xp: { increment: xpDelta },
                    badges: badge ? { push: badge } : undefined,
                },
            });
        }
        return this.prisma.ranking.create({
            data: { userId, xp: xpDelta, badges: badge ? [badge] : [] },
        });
    }
};
exports.RankingsService = RankingsService;
exports.RankingsService = RankingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RankingsService);
//# sourceMappingURL=rankings.service.js.map