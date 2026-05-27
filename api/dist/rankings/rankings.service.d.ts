import { PrismaService } from '../prisma/prisma.service';
export declare class RankingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUniversityLeaderboard(universityId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            department: import("@prisma/client").$Enums.Department | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        universityRank: number | null;
        departmentRank: number | null;
        codingRank: number | null;
        placementRank: number | null;
        xp: number;
        badges: string[];
        achievements: string[];
        streakDays: number;
    })[]>;
    getCodingLeaderboard(universityId?: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            leetcodeUsername: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        universityRank: number | null;
        departmentRank: number | null;
        codingRank: number | null;
        placementRank: number | null;
        xp: number;
        badges: string[];
        achievements: string[];
        streakDays: number;
    })[]>;
    getDepartmentLeaderboard(universityId: string, department: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        universityRank: number | null;
        departmentRank: number | null;
        codingRank: number | null;
        placementRank: number | null;
        xp: number;
        badges: string[];
        achievements: string[];
        streakDays: number;
    })[]>;
    getUserRanking(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        universityRank: number | null;
        departmentRank: number | null;
        codingRank: number | null;
        placementRank: number | null;
        xp: number;
        badges: string[];
        achievements: string[];
        streakDays: number;
    }) | null>;
    updateRanking(userId: string, xpDelta: number, badge?: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        universityRank: number | null;
        departmentRank: number | null;
        codingRank: number | null;
        placementRank: number | null;
        xp: number;
        badges: string[];
        achievements: string[];
        streakDays: number;
    }>;
}
