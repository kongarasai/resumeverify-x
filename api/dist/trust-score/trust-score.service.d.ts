import { PrismaService } from '../prisma/prisma.service';
interface TrustScoreComponents {
    resumeQualityScore?: number;
    githubScore?: number;
    leetcodeScore?: number;
    projectScore?: number;
    codingPerformance?: number;
    interviewPerformance?: number;
    communicationScore?: number;
    assignmentCompletion?: number;
    fraudPenalty?: number;
}
export declare class TrustScoreService {
    private prisma;
    constructor(prisma: PrismaService);
    private computeTrustLevel;
    private computeWeightedScore;
    private identifyWeakAreas;
    calculateTrustScore(userId: string): Promise<number>;
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
    getTrustHistory(userId: string): Promise<{
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
    updateComponent(userId: string, component: keyof TrustScoreComponents, score: number): Promise<number>;
}
export {};
