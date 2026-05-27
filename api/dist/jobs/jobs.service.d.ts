import { PrismaService } from '../prisma/prisma.service';
export declare class JobsService {
    private prisma;
    constructor(prisma: PrismaService);
    createJob(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string | null;
        title: string;
        location: string | null;
        techStack: string[];
        company: string;
        requirements: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        minCGPA: number | null;
        minTrustScore: number | null;
        postedById: string | null;
        deadline: Date | null;
    }>;
    searchJobs(query: string, type?: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string | null;
        title: string;
        location: string | null;
        techStack: string[];
        company: string;
        requirements: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        minCGPA: number | null;
        minTrustScore: number | null;
        postedById: string | null;
        deadline: Date | null;
    }[]>;
    getJobById(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string | null;
        title: string;
        location: string | null;
        techStack: string[];
        company: string;
        requirements: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        minCGPA: number | null;
        minTrustScore: number | null;
        postedById: string | null;
        deadline: Date | null;
    }>;
    applyJob(jobId: string, userId: string, coverLetter?: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        stage: import("@prisma/client").$Enums.PipelineStage;
        coverLetter: string | null;
        appliedAt: Date;
    }>;
    getApplicationsByUser(userId: string): Promise<({
        job: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            description: string | null;
            title: string;
            location: string | null;
            techStack: string[];
            company: string;
            requirements: string[];
            salaryMin: number | null;
            salaryMax: number | null;
            minCGPA: number | null;
            minTrustScore: number | null;
            postedById: string | null;
            deadline: Date | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        stage: import("@prisma/client").$Enums.PipelineStage;
        coverLetter: string | null;
        appliedAt: Date;
    })[]>;
    getKanbanBoard(recruiterId: string): Promise<Record<string, any[]>>;
    updatePipelineStage(applicationId: string, recruiterId: string, stage: string, notes?: string): Promise<{
        id: string;
        notes: string | null;
        stage: import("@prisma/client").$Enums.PipelineStage;
        applicationId: string;
        recruiterId: string;
        movedAt: Date;
    }>;
}
