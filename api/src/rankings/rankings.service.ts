import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingsService {
  constructor(private prisma: PrismaService) {}

  async getUniversityLeaderboard(universityId: string) {
    return this.prisma.ranking.findMany({
      where: { user: { universityId } },
      include: { user: { select: { id: true, name: true, avatarUrl: true, department: true } } },
      orderBy: { xp: 'desc' },
      take: 100,
    });
  }

  async getCodingLeaderboard(universityId?: string) {
    return this.prisma.ranking.findMany({
      where: universityId ? { user: { universityId } } : {},
      include: { user: { select: { id: true, name: true, avatarUrl: true, leetcodeUsername: true } } },
      orderBy: { codingRank: 'asc' },
      take: 100,
    });
  }

  async getDepartmentLeaderboard(universityId: string, department: string) {
    return this.prisma.ranking.findMany({
      where: { user: { universityId, department: department as any } },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { xp: 'desc' },
      take: 50,
    });
  }

  async getUserRanking(userId: string) {
    return this.prisma.ranking.findFirst({
      where: { userId },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async updateRanking(userId: string, xpDelta: number, badge?: string) {
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
}
