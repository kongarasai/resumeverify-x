import { FraudService } from './fraud.service';
export declare class FraudController {
    private readonly fraudService;
    constructor(fraudService: FraudService);
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
    getFraudReport(userId: string): Promise<{
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
}
