"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustScoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TrustScoreService = class TrustScoreService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    computeTrustLevel(score) {
        if (score >= 95)
            return client_1.TrustLevel.HIGHLY_TRUSTED;
        if (score >= 80)
            return client_1.TrustLevel.VERIFIED;
        if (score >= 40)
            return client_1.TrustLevel.MODERATE;
        return client_1.TrustLevel.HIGH_RISK;
    }
    computeWeightedScore(components) {
        const weights = {
            resumeQualityScore: 0.15,
            githubScore: 0.20,
            leetcodeScore: 0.15,
            projectScore: 0.15,
            codingPerformance: 0.10,
            interviewPerformance: 0.10,
            communicationScore: 0.10,
            assignmentCompletion: 0.05,
        };
        let weighted = 0;
        for (const [key, weight] of Object.entries(weights)) {
            weighted += (components[key] ?? 0) * weight;
        }
        const penalty = Math.min(components.fraudPenalty ?? 0, 30);
        return Math.max(0, Math.min(100, weighted - penalty));
    }
    identifyWeakAreas(components) {
        const thresholds = {
            resumeQualityScore: 60,
            githubScore: 60,
            leetcodeScore: 50,
            projectScore: 60,
            codingPerformance: 55,
            interviewPerformance: 55,
            communicationScore: 60,
            assignmentCompletion: 70,
        };
        const labels = {
            resumeQualityScore: 'Resume Quality',
            githubScore: 'GitHub Activity',
            leetcodeScore: 'LeetCode Performance',
            projectScore: 'Project Portfolio',
            codingPerformance: 'Coding Performance',
            interviewPerformance: 'Interview Skills',
            communicationScore: 'Communication',
            assignmentCompletion: 'Assignment Completion',
        };
        return Object.entries(thresholds)
            .filter(([key, threshold]) => (components[key] ?? 0) < threshold)
            .map(([key]) => labels[key]);
    }
    async calculateTrustScore(userId) {
        const existing = await this.prisma.trustScore.findUnique({
            where: { userId },
        });
        if (!existing) {
            await this.prisma.trustScore.create({ data: { userId } });
            return 0;
        }
        const components = {
            resumeQualityScore: existing.resumeQualityScore,
            githubScore: existing.githubScore,
            leetcodeScore: existing.leetcodeScore,
            projectScore: existing.projectScore,
            codingPerformance: existing.codingPerformance,
            interviewPerformance: existing.interviewPerformance,
            communicationScore: existing.communicationScore,
            assignmentCompletion: existing.assignmentCompletion,
            fraudPenalty: existing.fraudPenalty,
        };
        const totalScore = this.computeWeightedScore(components);
        const trustLevel = this.computeTrustLevel(totalScore);
        const weakAreas = this.identifyWeakAreas(components);
        const prevScore = existing.totalScore;
        const weeklyGrowth = totalScore - prevScore;
        const improvementSuggestions = weakAreas.map((area) => {
            const suggestions = {
                'Resume Quality': 'Update your resume with quantified achievements and ATS-friendly format',
                'GitHub Activity': 'Commit code regularly and maintain at least 3 starred projects',
                'LeetCode Performance': 'Solve 2 LeetCode problems daily, focus on DSA patterns',
                'Project Portfolio': 'Add deployed projects with documentation and live links',
                'Coding Performance': 'Participate in contests and improve speed accuracy',
                'Interview Skills': 'Practice mock interviews and behavioral questions',
                'Communication': 'Work on clarity, conciseness, and professional tone',
                'Assignment Completion': 'Submit all assignments before deadlines',
            };
            return suggestions[area] || `Improve your ${area}`;
        });
        await this.prisma.trustScore.update({
            where: { userId },
            data: {
                totalScore,
                trustLevel,
                weakAreas,
                weeklyGrowth,
                improvementSuggestions,
                lastCalculated: new Date(),
            },
        });
        await this.prisma.trustScoreHistory.create({
            data: {
                trustScoreId: existing.id,
                score: totalScore,
                reason: 'Recalculation triggered',
            },
        });
        return totalScore;
    }
    async getTrustScore(userId) {
        const trustScore = await this.prisma.trustScore.findUnique({
            where: { userId },
            include: {
                history: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!trustScore)
            throw new common_1.NotFoundException('Trust score not found for this user');
        return trustScore;
    }
    async getTrustHistory(userId) {
        const trustScore = await this.prisma.trustScore.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!trustScore)
            throw new common_1.NotFoundException('Trust score not found');
        const history = await this.prisma.trustScoreHistory.findMany({
            where: { trustScoreId: trustScore.id },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        return { history };
    }
    async getWeakAreas(userId) {
        const trustScore = await this.prisma.trustScore.findUnique({
            where: { userId },
            select: {
                weakAreas: true,
                improvementSuggestions: true,
                resumeQualityScore: true,
                githubScore: true,
                leetcodeScore: true,
                projectScore: true,
                codingPerformance: true,
                interviewPerformance: true,
                communicationScore: true,
                assignmentCompletion: true,
            },
        });
        if (!trustScore)
            throw new common_1.NotFoundException('Trust score not found');
        return {
            weakAreas: trustScore.weakAreas,
            improvementSuggestions: trustScore.improvementSuggestions,
            componentScores: {
                resume: trustScore.resumeQualityScore,
                github: trustScore.githubScore,
                leetcode: trustScore.leetcodeScore,
                projects: trustScore.projectScore,
                coding: trustScore.codingPerformance,
                interview: trustScore.interviewPerformance,
                communication: trustScore.communicationScore,
                assignments: trustScore.assignmentCompletion,
            },
        };
    }
    async updateComponent(userId, component, score) {
        const trustScore = await this.prisma.trustScore.findUnique({ where: { userId } });
        if (!trustScore) {
            await this.prisma.trustScore.create({ data: { userId } });
        }
        await this.prisma.trustScore.update({
            where: { userId },
            data: { [component]: Math.min(100, Math.max(0, score)) },
        });
        return this.calculateTrustScore(userId);
    }
};
exports.TrustScoreService = TrustScoreService;
exports.TrustScoreService = TrustScoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrustScoreService);
//# sourceMappingURL=trust-score.service.js.map