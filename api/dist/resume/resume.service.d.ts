import { PrismaService } from '../prisma/prisma.service';
import { TrustScoreService } from '../trust-score/trust-score.service';
import { ConfigService } from '@nestjs/config';
export declare class ResumeService {
    private prisma;
    private trustScoreService;
    private config;
    private openai;
    constructor(prisma: PrismaService, trustScoreService: TrustScoreService, config: ConfigService);
    uploadResume(userId: string, fileUrl: string, parsedText?: string): Promise<{
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
    parseResumeText(text: string): Promise<{
        skills: string[];
        education: string[];
        experience: string[];
        projects: string[];
        certifications: string[];
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
    generateFeedback(userId: string): Promise<any>;
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
}
