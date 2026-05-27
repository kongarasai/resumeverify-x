import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AssignmentType } from '@prisma/client';
export declare class CreateAssignmentDto {
    title: string;
    description?: string;
    type: AssignmentType;
    difficulty?: string;
    topic?: string;
    subject?: string;
    totalMarks?: number;
    groupId?: string;
    dueDate?: string;
}
export declare class SubmitAssignmentDto {
    code: string;
    language: string;
}
export declare class GenerateQuestionsDto {
    topic: string;
    type: AssignmentType;
    difficulty?: string;
    count?: number;
    subject?: string;
}
export declare class AssignmentsService {
    private prisma;
    private config;
    private openai;
    constructor(prisma: PrismaService, config: ConfigService);
    createAssignment(teacherId: string, dto: CreateAssignmentDto): Promise<{
        assignment: {
            group: {
                id: string;
                name: string;
            } | null;
            teacher: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.AssignmentType;
            description: string | null;
            title: string;
            difficulty: string;
            topic: string | null;
            subject: string | null;
            totalMarks: number;
            groupId: string | null;
            dueDate: Date | null;
            questions: import("@prisma/client/runtime/library").JsonValue | null;
            testCases: import("@prisma/client/runtime/library").JsonValue | null;
            isPublished: boolean;
            teacherId: string;
        };
        message: string;
    }>;
    publishAssignment(teacherId: string, assignmentId: string): Promise<{
        assignment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.AssignmentType;
            description: string | null;
            title: string;
            difficulty: string;
            topic: string | null;
            subject: string | null;
            totalMarks: number;
            groupId: string | null;
            dueDate: Date | null;
            questions: import("@prisma/client/runtime/library").JsonValue | null;
            testCases: import("@prisma/client/runtime/library").JsonValue | null;
            isPublished: boolean;
            teacherId: string;
        };
        message: string;
    }>;
    getAssignments(filters: {
        groupId?: string;
        teacherId?: string;
        type?: AssignmentType;
        isPublished?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        assignments: ({
            group: {
                id: string;
                name: string;
            } | null;
            _count: {
                submissions: number;
            };
            teacher: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.AssignmentType;
            description: string | null;
            title: string;
            difficulty: string;
            topic: string | null;
            subject: string | null;
            totalMarks: number;
            groupId: string | null;
            dueDate: Date | null;
            questions: import("@prisma/client/runtime/library").JsonValue | null;
            testCases: import("@prisma/client/runtime/library").JsonValue | null;
            isPublished: boolean;
            teacherId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAssignmentById(id: string): Promise<{
        group: {
            id: string;
            name: string;
        } | null;
        _count: {
            submissions: number;
        };
        teacher: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.AssignmentType;
        description: string | null;
        title: string;
        difficulty: string;
        topic: string | null;
        subject: string | null;
        totalMarks: number;
        groupId: string | null;
        dueDate: Date | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
        testCases: import("@prisma/client/runtime/library").JsonValue | null;
        isPublished: boolean;
        teacherId: string;
    }>;
    submitAssignment(userId: string, assignmentId: string, dto: SubmitAssignmentDto): Promise<{
        submission: {
            id: string;
            createdAt: Date;
            userId: string;
            code: string;
            score: number;
            language: string;
            problemSlug: string | null;
            status: string;
            executionTime: number | null;
            memoryUsed: number | null;
            testCasesPassed: number;
            totalTestCases: number;
            executionLogs: string | null;
            plagiarismScore: number;
            isFlagged: boolean;
            assignmentId: string | null;
        };
        message: string;
    }>;
    generateQuestions(dto: GenerateQuestionsDto): Promise<{
        questions: any;
        count: any;
        topic: string;
        type: import("@prisma/client").$Enums.AssignmentType;
    }>;
    deleteAssignment(teacherId: string, assignmentId: string): Promise<{
        message: string;
    }>;
}
