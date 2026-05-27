import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrustLevel } from '@prisma/client';

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

@Injectable()
export class TrustScoreService {
  constructor(private prisma: PrismaService) {}

  private computeTrustLevel(score: number): TrustLevel {
    if (score >= 95) return TrustLevel.HIGHLY_TRUSTED;
    if (score >= 80) return TrustLevel.VERIFIED;
    if (score >= 40) return TrustLevel.MODERATE;
    return TrustLevel.HIGH_RISK;
  }

  private computeWeightedScore(components: TrustScoreComponents): number {
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
      weighted += (components[key as keyof TrustScoreComponents] ?? 0) * weight;
    }

    // Subtract fraud penalty (0-30 points)
    const penalty = Math.min(components.fraudPenalty ?? 0, 30);
    return Math.max(0, Math.min(100, weighted - penalty));
  }

  private identifyWeakAreas(components: TrustScoreComponents): string[] {
    const thresholds: Record<string, number> = {
      resumeQualityScore: 60,
      githubScore: 60,
      leetcodeScore: 50,
      projectScore: 60,
      codingPerformance: 55,
      interviewPerformance: 55,
      communicationScore: 60,
      assignmentCompletion: 70,
    };

    const labels: Record<string, string> = {
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
      .filter(([key, threshold]) => (components[key as keyof TrustScoreComponents] ?? 0) < threshold)
      .map(([key]) => labels[key]);
  }

  async calculateTrustScore(userId: string): Promise<number> {
    const existing = await this.prisma.trustScore.findUnique({
      where: { userId },
    });

    if (!existing) {
      await this.prisma.trustScore.create({ data: { userId } });
      return 0;
    }

    const components: TrustScoreComponents = {
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
      const suggestions: Record<string, string> = {
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

    // Save history
    await this.prisma.trustScoreHistory.create({
      data: {
        trustScoreId: existing.id,
        score: totalScore,
        reason: 'Recalculation triggered',
      },
    });

    return totalScore;
  }

  async getTrustScore(userId: string) {
    const trustScore = await this.prisma.trustScore.findUnique({
      where: { userId },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!trustScore) throw new NotFoundException('Trust score not found for this user');

    return trustScore;
  }

  async getTrustHistory(userId: string) {
    const trustScore = await this.prisma.trustScore.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!trustScore) throw new NotFoundException('Trust score not found');

    const history = await this.prisma.trustScoreHistory.findMany({
      where: { trustScoreId: trustScore.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return { history };
  }

  async getWeakAreas(userId: string) {
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

    if (!trustScore) throw new NotFoundException('Trust score not found');

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

  async updateComponent(
    userId: string,
    component: keyof TrustScoreComponents,
    score: number,
  ) {
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
}
