// ResumeVerify X™ — Trust Score Service (NestJS)
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OpenAI } from 'openai';
import { Octokit } from '@octokit/rest';

@Injectable()
export class TrustScoreService {
  private openai: OpenAI;
  private octokit: Octokit;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async calculateTrustScore(candidateId: string): Promise<any> {
    const candidate = await this.prisma.candidates.findUnique({
      where: { id: candidateId },
      include: { users: true, projects: true, certifications: true }
    });
    if (!candidate) throw new Error('Candidate not found');

    const [
      resumeScore,
      githubScore,
      leetcodeScore,
      projectScore,
      fraudScore
    ] = await Promise.all([
      this.analyzeResume(candidateId),
      this.analyzeGithub(candidate.github_username),
      this.analyzeLeetCode(candidate.leetcode_username),
      this.analyzeProjects(candidate.projects),
      this.runFraudDetection(candidateId)
    ]);

    const totalScore = (
      resumeScore * 0.20 +
      githubScore * 0.25 +
      leetcodeScore * 0.20 +
      projectScore * 0.20 +
      (100 - fraudScore) * 0.15
    );

    await this.prisma.trust_scores.create({
      data: {
        candidate_id: candidateId,
        total_score: totalScore,
        resume_score: resumeScore,
        github_score: githubScore,
        leetcode_score: leetcodeScore,
        project_score: projectScore,
        fraud_risk_score: fraudScore,
        calculated_at: new Date(),
      }
    });

    return { totalScore, resumeScore, githubScore, leetcodeScore, projectScore, fraudScore };
  }

  private async analyzeResume(candidateId: string): Promise<number> {
    // AI-powered resume analysis using OpenAI
    const resume = await this.prisma.resumes?.findFirst({ where: { candidate_id: candidateId } });
    if (!resume) return 0;
    // GPT analysis of resume quality, keyword density, structure
    return Math.min(100, Math.random() * 30 + 70); // Placeholder
  }

  private async analyzeGithub(username: string): Promise<number> {
    if (!username) return 0;
    try {
      const { data: repos } = await this.octokit.repos.listForUser({ username, per_page: 100 });
      const repoCount = repos.length;
      const hasReadme = repos.filter(r => r.description).length;
      const hasDeployments = repos.filter(r => r.homepage).length;
      const score = Math.min(100,
        (repoCount * 0.5) + (hasReadme * 2) + (hasDeployments * 3)
      );
      return score;
    } catch { return 0; }
  }

  private async analyzeLeetCode(username: string): Promise<number> {
    if (!username) return 0;
    // Fetch from LeetCode GraphQL API
    return Math.min(100, Math.random() * 40 + 50); // Placeholder
  }

  private async analyzeProjects(projects: any[]): Promise<number> {
    if (!projects.length) return 0;
    const verifiedCount = projects.filter(p => p.is_verified).length;
    return Math.min(100, (verifiedCount / Math.max(projects.length, 1)) * 100);
  }

  private async runFraudDetection(candidateId: string): Promise<number> {
    // AI fraud probability (0 = no fraud, 100 = definite fraud)
    return Math.random() * 10; // Placeholder — very low fraud
  }
}
