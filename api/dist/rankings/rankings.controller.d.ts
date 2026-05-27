import { RankingsService } from './rankings.service';
export declare class RankingsController {
    private readonly rankingsService;
    constructor(rankingsService: RankingsService);
    university(universityId: string): Promise<({
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
    coding(universityId?: string): Promise<({
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
    department(universityId: string, department: string): Promise<({
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
    user(userId: string): Promise<({
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
}
