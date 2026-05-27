import { TrustScoreService } from './trust-score.service';
export declare class TrustScoreController {
    private readonly trustScoreService;
    constructor(trustScoreService: TrustScoreService);
    getMyTrustScore(userId: string): Promise<{
        history: {
            id: string;
            createdAt: Date;
            score: number;
            reason: string | null;
            trustScoreId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalScore: number;
        trustLevel: import("@prisma/client").$Enums.TrustLevel;
        resumeQualityScore: number;
        githubScore: number;
        leetcodeScore: number;
        projectScore: number;
        codingPerformance: number;
        interviewPerformance: number;
        communicationScore: number;
        assignmentCompletion: number;
        learningConsistency: number;
        fraudPenalty: number;
        aiExplanation: string | null;
        weakAreas: string[];
        improvementSuggestions: string[];
        weeklyGrowth: number;
        lastCalculated: Date;
        userId: string;
    }>;
    getTrustScore(userId: string): Promise<{
        history: {
            id: string;
            createdAt: Date;
            score: number;
            reason: string | null;
            trustScoreId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalScore: number;
        trustLevel: import("@prisma/client").$Enums.TrustLevel;
        resumeQualityScore: number;
        githubScore: number;
        leetcodeScore: number;
        projectScore: number;
        codingPerformance: number;
        interviewPerformance: number;
        communicationScore: number;
        assignmentCompletion: number;
        learningConsistency: number;
        fraudPenalty: number;
        aiExplanation: string | null;
        weakAreas: string[];
        improvementSuggestions: string[];
        weeklyGrowth: number;
        lastCalculated: Date;
        userId: string;
    }>;
    recalculate(userId: string): Promise<number>;
    getHistory(userId: string): Promise<{
        history: {
            id: string;
            createdAt: Date;
            score: number;
            reason: string | null;
            trustScoreId: string;
        }[];
    }>;
    getWeakAreas(userId: string): Promise<{
        weakAreas: string[];
        improvementSuggestions: string[];
        componentScores: {
            resume: number;
            github: number;
            leetcode: number;
            projects: number;
            coding: number;
            interview: number;
            communication: number;
            assignments: number;
        };
    }>;
}
