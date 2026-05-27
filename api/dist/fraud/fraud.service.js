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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const trust_score_service_1 = require("../trust-score/trust-score.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const openai_1 = __importDefault(require("openai"));
let FraudService = class FraudService {
    prisma;
    trustScoreService;
    config;
    openai;
    constructor(prisma, trustScoreService, config) {
        this.prisma = prisma;
        this.trustScoreService = trustScoreService;
        this.config = config;
        this.openai = new openai_1.default({
            apiKey: this.config.get('OPENAI_API_KEY'),
        });
    }
    computeRiskLevel(probability) {
        if (probability >= 0.75)
            return client_1.FraudRisk.CRITICAL;
        if (probability >= 0.5)
            return client_1.FraudRisk.HIGH;
        if (probability >= 0.25)
            return client_1.FraudRisk.MEDIUM;
        return client_1.FraudRisk.LOW;
    }
    async analyzeFraud(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                resume: true,
                projects: true,
                trustScore: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const resumeText = user.resume?.parsedText || 'No resume available';
        const projects = user.projects.map((p) => ({
            title: p.title,
            description: p.description,
            githubUrl: p.githubUrl,
            techStack: p.techStack,
        }));
        const prompt = `
You are an expert fraud detection analyst for a resume verification platform. 
Analyze this candidate profile for signs of fraudulent activity.

Candidate:
- GitHub: ${user.githubUsername || 'Not connected'}
- Resume Summary: ${resumeText.substring(0, 3000)}
- Projects: ${JSON.stringify(projects, null, 2)}
- Resume Scores: ${JSON.stringify({
            overall: user.resume?.overallScore,
            structure: user.resume?.structureScore,
            skills: user.resume?.skillRelevanceScore,
        })}

Detect fraud indicators for:
1. Fake or AI-generated resume content
2. Copied/plagiarized project descriptions
3. Fake GitHub activity (bot-like commits, inflated stats)
4. Impossible timelines (overlapping experiences)
5. AI-generated project descriptions
6. Suspicious coding patterns
7. Fake certifications or education

Return ONLY valid JSON:
{
  "fraudProbability": number (0.0 to 1.0),
  "fakeResume": boolean,
  "copiedProjects": boolean,
  "aiGeneratedContent": boolean,
  "fakeGithubActivity": boolean,
  "fakeCertificates": boolean,
  "suspiciousCoding": boolean,
  "impossibleTimelines": boolean,
  "evidence": string[],
  "warnings": string[],
  "aiAnalysis": string,
  "integrityScore": number (0-100)
}
    `;
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            response_format: { type: 'json_object' },
        });
        let analysis;
        try {
            analysis = JSON.parse(response.choices[0].message.content || '{}');
        }
        catch {
            analysis = {
                fraudProbability: 0,
                integrityScore: 100,
                fakeResume: false,
                copiedProjects: false,
                aiGeneratedContent: false,
                fakeGithubActivity: false,
                fakeCertificates: false,
                suspiciousCoding: false,
                impossibleTimelines: false,
                evidence: [],
                warnings: [],
                aiAnalysis: 'Analysis could not be completed',
            };
        }
        const riskLevel = this.computeRiskLevel(analysis.fraudProbability || 0);
        const fraudAnalysis = await this.prisma.fraudAnalysis.upsert({
            where: { userId },
            create: {
                userId,
                fraudProbability: analysis.fraudProbability || 0,
                riskLevel,
                integrityScore: analysis.integrityScore || 100,
                fakeResume: analysis.fakeResume || false,
                copiedProjects: analysis.copiedProjects || false,
                aiGeneratedContent: analysis.aiGeneratedContent || false,
                fakeGithubActivity: analysis.fakeGithubActivity || false,
                fakeCertificates: analysis.fakeCertificates || false,
                suspiciousCoding: analysis.suspiciousCoding || false,
                impossibleTimelines: analysis.impossibleTimelines || false,
                evidence: analysis.evidence || [],
                warnings: analysis.warnings || [],
                aiAnalysis: analysis.aiAnalysis || '',
                lastAnalyzed: new Date(),
            },
            update: {
                fraudProbability: analysis.fraudProbability || 0,
                riskLevel,
                integrityScore: analysis.integrityScore || 100,
                fakeResume: analysis.fakeResume || false,
                copiedProjects: analysis.copiedProjects || false,
                aiGeneratedContent: analysis.aiGeneratedContent || false,
                fakeGithubActivity: analysis.fakeGithubActivity || false,
                fakeCertificates: analysis.fakeCertificates || false,
                suspiciousCoding: analysis.suspiciousCoding || false,
                impossibleTimelines: analysis.impossibleTimelines || false,
                evidence: analysis.evidence || [],
                warnings: analysis.warnings || [],
                aiAnalysis: analysis.aiAnalysis || '',
                lastAnalyzed: new Date(),
            },
        });
        const fraudPenalty = Math.round(analysis.fraudProbability * 30);
        await this.trustScoreService.updateComponent(userId, 'fraudPenalty', fraudPenalty);
        await this.prisma.aIReport.create({
            data: {
                userId,
                reportType: 'FRAUD_REPORT',
                response: analysis,
                tokensUsed: response.usage?.total_tokens || 0,
                model: 'gpt-4o',
            },
        });
        return { fraudAnalysis, message: 'Fraud analysis completed' };
    }
    async generateFraudReport(userId) {
        const fraudAnalysis = await this.prisma.fraudAnalysis.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { name: true, email: true, githubUsername: true },
                },
            },
        });
        if (!fraudAnalysis)
            throw new common_1.NotFoundException('Fraud analysis not found. Run analysis first.');
        const flagCount = [
            fraudAnalysis.fakeResume,
            fraudAnalysis.copiedProjects,
            fraudAnalysis.aiGeneratedContent,
            fraudAnalysis.fakeGithubActivity,
            fraudAnalysis.fakeCertificates,
            fraudAnalysis.suspiciousCoding,
            fraudAnalysis.impossibleTimelines,
        ].filter(Boolean).length;
        return {
            summary: {
                userId,
                candidateName: fraudAnalysis.user.name,
                riskLevel: fraudAnalysis.riskLevel,
                fraudProbability: fraudAnalysis.fraudProbability,
                integrityScore: fraudAnalysis.integrityScore,
                flagCount,
                lastAnalyzed: fraudAnalysis.lastAnalyzed,
            },
            flags: {
                fakeResume: fraudAnalysis.fakeResume,
                copiedProjects: fraudAnalysis.copiedProjects,
                aiGeneratedContent: fraudAnalysis.aiGeneratedContent,
                fakeGithubActivity: fraudAnalysis.fakeGithubActivity,
                fakeCertificates: fraudAnalysis.fakeCertificates,
                suspiciousCoding: fraudAnalysis.suspiciousCoding,
                impossibleTimelines: fraudAnalysis.impossibleTimelines,
            },
            evidence: fraudAnalysis.evidence,
            warnings: fraudAnalysis.warnings,
            aiAnalysis: fraudAnalysis.aiAnalysis,
        };
    }
    async updateFraudScore(userId, updates) {
        const existing = await this.prisma.fraudAnalysis.findUnique({ where: { userId } });
        if (!existing)
            throw new common_1.NotFoundException('Fraud analysis not found');
        const updated = await this.prisma.fraudAnalysis.update({
            where: { userId },
            data: {
                ...updates,
                riskLevel: updates.fraudProbability !== undefined
                    ? this.computeRiskLevel(updates.fraudProbability)
                    : existing.riskLevel,
                lastAnalyzed: new Date(),
            },
        });
        return { fraudAnalysis: updated };
    }
};
exports.FraudService = FraudService;
exports.FraudService = FraudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        trust_score_service_1.TrustScoreService,
        config_1.ConfigService])
], FraudService);
//# sourceMappingURL=fraud.service.js.map