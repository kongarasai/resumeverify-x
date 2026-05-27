import { ResumeService } from './resume.service';
declare class UploadResumeDto {
    parsedText?: string;
}
export declare class ResumeController {
    private readonly resumeService;
    constructor(resumeService: ResumeService);
    uploadResume(userId: string, file: Express.Multer.File, dto: UploadResumeDto): Promise<{
        resume: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            weakAreas: string[];
            userId: string;
            fileUrl: string | null;
            parsedText: string | null;
            overallScore: number;
            structureScore: number;
            skillRelevanceScore: number;
            projectQualityScore: number;
            keywordScore: number;
            experienceScore: number;
            heatmapData: import("@prisma/client/runtime/library").JsonValue | null;
            aiFeedback: string | null;
            improvementTips: string[];
            isAnalyzed: boolean;
            lastAnalyzed: Date | null;
        };
        message: string;
    }>;
    analyzeMyResume(userId: string): Promise<{
        resume: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            weakAreas: string[];
            userId: string;
            fileUrl: string | null;
            parsedText: string | null;
            overallScore: number;
            structureScore: number;
            skillRelevanceScore: number;
            projectQualityScore: number;
            keywordScore: number;
            experienceScore: number;
            heatmapData: import("@prisma/client/runtime/library").JsonValue | null;
            aiFeedback: string | null;
            improvementTips: string[];
            isAnalyzed: boolean;
            lastAnalyzed: Date | null;
        };
        message: string;
    }>;
    analyzeResume(userId: string): Promise<{
        resume: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            weakAreas: string[];
            userId: string;
            fileUrl: string | null;
            parsedText: string | null;
            overallScore: number;
            structureScore: number;
            skillRelevanceScore: number;
            projectQualityScore: number;
            keywordScore: number;
            experienceScore: number;
            heatmapData: import("@prisma/client/runtime/library").JsonValue | null;
            aiFeedback: string | null;
            improvementTips: string[];
            isAnalyzed: boolean;
            lastAnalyzed: Date | null;
        };
        message: string;
    }>;
    getMyResume(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        userId: string;
        fileUrl: string | null;
        parsedText: string | null;
        overallScore: number;
        structureScore: number;
        skillRelevanceScore: number;
        projectQualityScore: number;
        keywordScore: number;
        experienceScore: number;
        heatmapData: import("@prisma/client/runtime/library").JsonValue | null;
        aiFeedback: string | null;
        improvementTips: string[];
        isAnalyzed: boolean;
        lastAnalyzed: Date | null;
    }>;
    getResume(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        userId: string;
        fileUrl: string | null;
        parsedText: string | null;
        overallScore: number;
        structureScore: number;
        skillRelevanceScore: number;
        projectQualityScore: number;
        keywordScore: number;
        experienceScore: number;
        heatmapData: import("@prisma/client/runtime/library").JsonValue | null;
        aiFeedback: string | null;
        improvementTips: string[];
        isAnalyzed: boolean;
        lastAnalyzed: Date | null;
    }>;
    getFeedback(userId: string): Promise<any>;
    parseText(text: string): Promise<{
        skills: string[];
        education: string[];
        experience: string[];
        projects: string[];
        certifications: string[];
    }>;
}
export {};
