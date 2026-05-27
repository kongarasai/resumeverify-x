import { PrismaService } from '../prisma/prisma.service';
import { Department } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
export declare class UpdateProfileDto {
    name?: string;
    bio?: string;
    phone?: string;
    githubUsername?: string;
    leetcodeUsername?: string;
    linkedinUrl?: string;
    codechefUsername?: string;
    hackerrankUsername?: string;
    department?: Department;
}
export declare class UpdateAvatarDto {
    avatarUrl?: string;
}
export declare class UsersService {
    private prisma;
    private config;
    constructor(prisma: PrismaService, config: ConfigService);
    findById(id: string): Promise<{
        university: {
            id: string;
            name: string;
            code: string;
            logoUrl: string | null;
        } | null;
        trustScore: {
            totalScore: number;
            trustLevel: import("@prisma/client").$Enums.TrustLevel;
            weakAreas: string[];
            lastCalculated: Date;
        } | null;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        bio: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        isVerified: boolean;
        twoFactorEnabled: boolean;
        onboardingDone: boolean;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        githubUsername: string | null;
        leetcodeUsername: string | null;
        linkedinUrl: string | null;
        codechefUsername: string | null;
        hackerrankUsername: string | null;
        skills: import("@prisma/client/runtime/library").JsonValue;
        experience: import("@prisma/client/runtime/library").JsonValue;
        certifications: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        department: import("@prisma/client").$Enums.Department | null;
        rankings: {
            universityRank: number | null;
            departmentRank: number | null;
            codingRank: number | null;
            xp: number;
            badges: string[];
            streakDays: number;
        }[];
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        phone: string | null;
        bio: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        isVerified: boolean;
        isActive: boolean;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        onboardingDone: boolean;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        githubUsername: string | null;
        githubToken: string | null;
        leetcodeUsername: string | null;
        linkedinUrl: string | null;
        codechefUsername: string | null;
        hackerrankUsername: string | null;
        skills: import("@prisma/client/runtime/library").JsonValue | null;
        experience: import("@prisma/client/runtime/library").JsonValue | null;
        certifications: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        universityId: string | null;
        department: import("@prisma/client").$Enums.Department | null;
    } | null>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            bio: string | null;
            githubUsername: string | null;
            leetcodeUsername: string | null;
            linkedinUrl: string | null;
            updatedAt: Date;
            department: import("@prisma/client").$Enums.Department | null;
        };
        message: string;
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        user: {
            id: string;
            avatarUrl: string | null;
        };
        message: string;
    }>;
    getConnectedAccounts(userId: string): Promise<{
        github: {
            connected: boolean;
            username: string | null;
        };
        leetcode: {
            connected: boolean;
            username: string | null;
        };
        linkedin: {
            connected: boolean;
            url: string | null;
        };
        codechef: {
            connected: boolean;
            username: string | null;
        };
        hackerrank: {
            connected: boolean;
            username: string | null;
        };
    }>;
    connectGithub(userId: string, username: string): Promise<{
        message: string;
        profile: {
            login: any;
            publicRepos: any;
            followers: any;
            following: any;
        };
    }>;
    syncGithub(userId: string): Promise<{
        message: string;
        data: {
            publicRepos: any;
            followers: any;
            following: any;
            totalStars: any;
            languages: unknown[];
            topRepos: any;
        };
    }>;
    getPublicProfile(userId: string): Promise<{
        university: {
            name: string;
            logoUrl: string | null;
        } | null;
        trustScore: {
            totalScore: number;
            trustLevel: import("@prisma/client").$Enums.TrustLevel;
        } | null;
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        githubUsername: string | null;
        linkedinUrl: string | null;
        createdAt: Date;
        department: import("@prisma/client").$Enums.Department | null;
        projects: {
            id: string;
            description: string | null;
            title: string;
            githubUrl: string | null;
            liveUrl: string | null;
            techStack: string[];
        }[];
        rankings: {
            universityRank: number | null;
            codingRank: number | null;
            xp: number;
            badges: string[];
        }[];
    }>;
}
