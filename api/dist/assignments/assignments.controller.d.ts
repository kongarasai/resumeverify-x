import { AssignmentType } from '@prisma/client';
import { AssignmentsService, CreateAssignmentDto, SubmitAssignmentDto, GenerateQuestionsDto } from './assignments.service';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(teacherId: string, dto: CreateAssignmentDto): Promise<{
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
    publish(teacherId: string, id: string): Promise<{
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
    getAll(groupId?: string, teacherId?: string, type?: AssignmentType, page?: number, limit?: number): Promise<{
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
    getById(id: string): Promise<{
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
    submit(userId: string, id: string, dto: SubmitAssignmentDto): Promise<{
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
    delete(teacherId: string, id: string): Promise<{
        message: string;
    }>;
}
