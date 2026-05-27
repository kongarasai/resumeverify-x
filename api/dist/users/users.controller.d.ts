import { UsersService, UpdateProfileDto, UpdateAvatarDto } from './users.service';
declare class ConnectGithubDto {
    username: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(userId: string): Promise<{
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
    updateMe(userId: string, dto: UpdateProfileDto): Promise<{
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
    updateAvatar(userId: string, dto: UpdateAvatarDto): Promise<{
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
    connectGithub(userId: string, dto: ConnectGithubDto): Promise<{
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
    getPublicProfile(id: string): Promise<{
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
export {};
