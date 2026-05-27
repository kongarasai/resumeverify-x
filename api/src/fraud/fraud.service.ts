import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrustScoreService } from '../trust-score/trust-score.service';
import { ConfigService } from '@nestjs/config';
import { FraudRisk } from '@prisma/client';
import OpenAI from 'openai';
import axios from 'axios';

@Injectable()
export class FraudService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private trustScoreService: TrustScoreService,
    private config: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  private computeRiskLevel(probability: number): FraudRisk {
    if (probability >= 0.75) return FraudRisk.CRITICAL;
    if (probability >= 0.5) return FraudRisk.HIGH;
    if (probability >= 0.25) return FraudRisk.MEDIUM;
    return FraudRisk.LOW;
  }

  async analyzeFraud(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        resume: true,
        projects: true,
        trustScore: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

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

    let analysis: any;
    try {
      analysis = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
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

    // Compute fraud penalty (0-30 based on probability)
    const fraudPenalty = Math.round(analysis.fraudProbability * 30);
    await this.trustScoreService.updateComponent(userId, 'fraudPenalty', fraudPenalty);

    // Save AI Report
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

  async generateFraudReport(userId: string) {
    const fraudAnalysis = await this.prisma.fraudAnalysis.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true, githubUsername: true },
        },
      },
    });

    if (!fraudAnalysis) throw new NotFoundException('Fraud analysis not found. Run analysis first.');

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

  async updateFraudScore(userId: string, updates: Partial<{
    fraudProbability: number;
    integrityScore: number;
    fakeResume: boolean;
  }>) {
    const existing = await this.prisma.fraudAnalysis.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('Fraud analysis not found');

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
}
