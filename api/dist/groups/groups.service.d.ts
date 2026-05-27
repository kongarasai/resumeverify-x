import { PrismaService } from '../prisma/prisma.service';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    createGroup(data: {
        name: string;
        description?: string;
        createdById: string;
        universityId?: string;
    }): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        universityId: string | null;
        description: string | null;
        coverImage: string | null;
        createdById: string;
    }>;
    getGroupById(id: string): Promise<{
        _count: {
            members: number;
        };
        createdBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        universityId: string | null;
        description: string | null;
        coverImage: string | null;
        createdById: string;
    }>;
    getUserGroups(userId: string): Promise<({
        group: {
            _count: {
                members: number;
                assignments: number;
            };
        } & {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            universityId: string | null;
            description: string | null;
            coverImage: string | null;
            createdById: string;
        };
    } & {
        id: string;
        role: string;
        userId: string;
        groupId: string;
        joinedAt: Date;
    })[]>;
    joinGroup(groupId: string, userId: string): Promise<{
        id: string;
        role: string;
        userId: string;
        groupId: string;
        joinedAt: Date;
    }>;
    getGroupMembers(groupId: string): Promise<({
        user: {
            trustScore: {
                totalScore: number;
            } | null;
            id: string;
            name: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
        } & {
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
        };
    } & {
        id: string;
        role: string;
        userId: string;
        groupId: string;
        joinedAt: Date;
    })[]>;
    addAnnouncement(groupId: string, authorId: string, title: string, content: string, isPinned?: boolean): Promise<{
        id: string;
        createdAt: Date;
        universityId: string | null;
        title: string;
        content: string;
        groupId: string | null;
        isPinned: boolean;
        authorId: string;
    }>;
    getAnnouncements(groupId: string): Promise<{
        id: string;
        createdAt: Date;
        universityId: string | null;
        title: string;
        content: string;
        groupId: string | null;
        isPinned: boolean;
        authorId: string;
    }[]>;
}
