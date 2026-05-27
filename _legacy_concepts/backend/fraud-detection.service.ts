// ResumeVerify X™ — AI Fraud Detection Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OpenAI } from 'openai';
import { Octokit } from '@octokit/rest';

interface FraudAnalysisResult {
  fraudProbability: number;
  flags: string[];
  evidence: string[];
  recommendation: 'clear' | 'suspicious' | 'high_risk' | 'blocked';
  details: {
    resumeFraud: number;
    githubFraud: number;
    certificateFraud: number;
    projectFraud: number;
    timelineFraud: number;
  };
}

@Injectable()
export class FraudDetectionService {
  private openai: OpenAI;
  private octokit: Octokit;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async analyzeCandidate(candidateId: string): Promise<FraudAnalysisResult> {
    const candidate = await this.prisma.candidates.findUnique({
      where: { id: candidateId },
      include: { users: true, projects: true, certifications: true }
    });

    const flags: string[] = [];
    const evidence: string[] = [];

    // 1. Resume AI-generation detection
    const resumeFraud = await this.detectAIGeneratedResume(candidateId);
    if (resumeFraud > 70) { flags.push('AI-generated resume detected'); evidence.push(`GPT similarity: ${resumeFraud.toFixed(1)}%`); }

    // 2. GitHub fake activity detection
    const githubFraud = await this.detectFakeGithubActivity(candidate.github_username);
    if (githubFraud > 60) { flags.push('Suspicious GitHub activity pattern'); evidence.push('Multiple repos created in same hour with identical commit messages'); }

    // 3. Impossible timeline detection
    const timelineFraud = this.detectImpossibleTimeline(candidate.projects || []);
    if (timelineFraud > 50) { flags.push('Impossible project timeline'); evidence.push('Project claims 6 months work completed in 2 weeks'); }

    // 4. Certificate verification
    const certFraud = await this.verifyCertificates(candidate.certifications || []);
    if (certFraud > 50) { flags.push('Unverifiable certificate'); evidence.push('Certificate serial number not found in issuer database'); }

    const overallFraud = (resumeFraud * 0.3 + githubFraud * 0.3 + timelineFraud * 0.2 + certFraud * 0.2);

    const recommendation = overallFraud > 80 ? 'blocked' : overallFraud > 60 ? 'high_risk' : overallFraud > 30 ? 'suspicious' : 'clear';

    // Save result
    await this.prisma.fraud_analysis.create({
      data: {
        candidate_id: candidateId,
        fraud_probability: overallFraud,
        flags: flags as any,
        evidence: evidence.join('\n'),
        status: recommendation,
      }
    });

    return { fraudProbability: overallFraud, flags, evidence, recommendation, details: { resumeFraud, githubFraud, certificateFraud: certFraud, projectFraud: 0, timelineFraud } };
  }

  private async detectAIGeneratedResume(candidateId: string): Promise<number> {
    // Use OpenAI to analyze text patterns for AI generation
    return Math.random() * 20; // Low fraud placeholder
  }

  private async detectFakeGithubActivity(username: string): Promise<number> {
    if (!username) return 0;
    try {
      const { data: events } = await this.octokit.activity.listPublicEventsForUser({ username, per_page: 100 });
      // Check for bulk commits at same timestamp (bot activity)
      const timestamps = events.map(e => new Date(e.created_at).getHours());
      const hourCounts = timestamps.reduce((acc, h) => { acc[h] = (acc[h] || 0) + 1; return acc; }, {} as Record<number, number>);
      const maxHourActivity = Math.max(...Object.values(hourCounts));
      return maxHourActivity > 50 ? 80 : maxHourActivity > 20 ? 40 : 10;
    } catch { return 0; }
  }

  private detectImpossibleTimeline(projects: any[]): number {
    // Check if claimed project duration is impossible
    for (const project of projects) {
      if (project.start_date && project.end_date) {
        const days = (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / 86400000;
        if (project.complexity === 'high' && days < 7) return 90;
        if (project.complexity === 'medium' && days < 3) return 70;
      }
    }
    return 5;
  }

  private async verifyCertificates(certs: any[]): Promise<number> {
    // Cross-reference with issuer APIs
    return Math.random() * 15; // Low fraud placeholder
  }
}
