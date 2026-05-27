import { PrismaService } from '../prisma/prisma.service';
import { TrustScoreService } from '../trust-score/trust-score.service';
import { ConfigService } from '@nestjs/config';
export declare class FraudService {
    private prisma;
    private trustScoreService;
    private config;
    private openai;
    constructor(prisma: PrismaService, trustScoreService: TrustScoreService, config: ConfigService);
    private computeRiskLevel;
    analyzeFraud(userId: string): Promise<{
        fraudAnalysis: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            aiAnalysis: string | null;
            lastAnalyzed: Date;
            fraudProbability: number;
            riskLevel: import("@prisma/client").$Enums.FraudRisk;
            integrityScore: number;
            fakeResume: boolean;
            copiedProjects: boolean;
            aiGeneratedContent: boolean;
            fakeGithubActivity: boolean;
            fakeCertificates: boolean;
            suspiciousCoding: boolean;
            impossibleTimelines: boolean;
            evidence: string[];
            warnings: string[];
        };
        message: string;
    }>;
    generateFraudReport(userId: string): Promise<{
        summary: {
            userId: string;
            candidateName: string;
            riskLevel: import("@prisma/client").$Enums.FraudRisk;
            fraudProbability: number;
            integrityScore: number;
            flagCount: number;
            lastAnalyzed: Date;
        };
        flags: {
            fakeResume: boolean;
            copiedProjects: boolean;
            aiGeneratedContent: boolean;
            fakeGithubActivity: boolean;
            fakeCertificates: boolean;
            suspiciousCoding: boolean;
            impossibleTimelines: boolean;
        };
        evidence: string[];
        warnings: string[];
        aiAnalysis: string | null;
    }>;
    updateFraudScore(userId: string, updates: Partial<{
        fraudProbability: number;
        integrityScore: number;
        fakeResume: boolean;
    }>): Promise<{
        fraudAnalysis: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            aiAnalysis: string | null;
            lastAnalyzed: Date;
            fraudProbability: number;
            riskLevel: import("@prisma/client").$Enums.FraudRisk;
            integrityScore: number;
            fakeResume: boolean;
            copiedProjects: boolean;
            aiGeneratedContent: boolean;
            fakeGithubActivity: boolean;
            fakeCertificates: boolean;
            suspiciousCoding: boolean;
            impossibleTimelines: boolean;
            evidence: string[];
            warnings: string[];
        };
    }>;
}
