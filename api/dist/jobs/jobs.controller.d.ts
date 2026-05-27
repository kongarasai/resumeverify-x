import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(body: any): Promise<{
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
    search(q: string, type: string): Promise<{
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
    myApplications(req: any): Promise<({
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
    kanban(req: any): Promise<Record<string, any[]>>;
    findOne(id: string): Promise<{
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
    apply(id: string, req: any, coverLetter?: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        stage: import("@prisma/client").$Enums.PipelineStage;
        coverLetter: string | null;
        appliedAt: Date;
    }>;
    updateStage(applicationId: string, req: any, stage: string, notes?: string): Promise<{
        id: string;
        notes: string | null;
        stage: import("@prisma/client").$Enums.PipelineStage;
        applicationId: string;
        recruiterId: string;
        movedAt: Date;
    }>;
}
