import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrustScoreService } from '../trust-score/trust-score.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResumeService {
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

  async uploadResume(userId: string, fileUrl: string, parsedText?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const resume = await this.prisma.resume.upsert({
      where: { userId },
      create: {
        userId,
        fileUrl,
        parsedText: parsedText || null,
      },
      update: {
        fileUrl,
        parsedText: parsedText || undefined,
        isAnalyzed: false,
        lastAnalyzed: null,
      },
    });

    return { resume, message: 'Resume uploaded successfully. Run analysis to get insights.' };
  }

  async parseResumeText(text: string): Promise<{
    skills: string[];
    education: string[];
    experience: string[];
    projects: string[];
    certifications: string[];
  }> {
    const prompt = `
Extract structured information from this resume text. Return valid JSON with these fields:
- skills: array of technical and soft skills
- education: array of education entries
- experience: array of work experience entries
- projects: array of project names/descriptions
- certifications: array of certifications

Resume text:
${text.substring(0, 8000)}

Return ONLY valid JSON, no explanation.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      return { skills: [], education: [], experience: [], projects: [], certifications: [] };
    }
  }

  async analyzeResume(userId: string) {
    const resume = await this.prisma.resume.findUnique({ where: { userId } });
    if (!resume) throw new NotFoundException('Resume not found. Please upload first.');
    if (!resume.parsedText && !resume.fileUrl) {
      throw new BadRequestException('No resume content available for analysis');
    }

    const text = resume.parsedText || 'Resume text not available for analysis';

    const prompt = `
You are an expert resume analyst and ATS specialist. Analyze this resume and provide detailed scoring.

Resume Content:
${text.substring(0, 8000)}

Analyze and score (0-100) on these dimensions:
1. Structure Score: Layout, formatting, sections organization, ATS compatibility
2. Skill Relevance Score: Technical skills quality, relevance, and presentation
3. Project Quality Score: Project descriptions, impact, tech stack
4. Keyword Score: Industry keywords, ATS optimization
5. Experience Score: Work experience, internships, impact statements
6. Overall Score: Holistic evaluation

Also identify:
- Top 5 weak areas needing improvement
- Top 5 actionable improvement tips
- ATS feedback summary
- Overall AI feedback paragraph

Return ONLY this exact JSON structure:
{
  "structureScore": number,
  "skillRelevanceScore": number,
  "projectQualityScore": number,
  "keywordScore": number,
  "experienceScore": number,
  "overallScore": number,
  "weakAreas": string[],
  "improvementTips": string[],
  "aiFeedback": string
}
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    let scores: any;
    try {
      scores = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      throw new BadRequestException('Failed to parse AI analysis response');
    }

    const overallScore = scores.overallScore ||
      Math.round(
        (scores.structureScore + scores.skillRelevanceScore +
          scores.projectQualityScore + scores.keywordScore + scores.experienceScore) / 5,
      );

    const updatedResume = await this.prisma.resume.update({
      where: { userId },
      data: {
        structureScore: scores.structureScore ?? 0,
        skillRelevanceScore: scores.skillRelevanceScore ?? 0,
        projectQualityScore: scores.projectQualityScore ?? 0,
        keywordScore: scores.keywordScore ?? 0,
        experienceScore: scores.experienceScore ?? 0,
        overallScore,
        weakAreas: scores.weakAreas || [],
        improvementTips: scores.improvementTips || [],
        aiFeedback: scores.aiFeedback || '',
        isAnalyzed: true,
        lastAnalyzed: new Date(),
        heatmapData: {
          structure: scores.structureScore,
          skills: scores.skillRelevanceScore,
          projects: scores.projectQualityScore,
          keywords: scores.keywordScore,
          experience: scores.experienceScore,
        },
      },
    });

    // Update trust score component
    await this.trustScoreService.updateComponent(userId, 'resumeQualityScore', overallScore);

    // Save AI report
    await this.prisma.aIReport.create({
      data: {
        userId,
        reportType: 'RESUME_ANALYSIS',
        response: scores,
        tokensUsed: response.usage?.total_tokens || 0,
        model: 'gpt-4o',
      },
    });

    return { resume: updatedResume, message: 'Resume analyzed successfully' };
  }

  async generateFeedback(userId: string) {
    const resume = await this.prisma.resume.findUnique({ where: { userId } });
    if (!resume || !resume.isAnalyzed) {
      throw new NotFoundException('Please analyze your resume first');
    }

    const prompt = `
Based on these resume scores, generate detailed, encouraging, and actionable feedback:
- Structure: ${resume.structureScore}/100
- Skills: ${resume.skillRelevanceScore}/100
- Projects: ${resume.projectQualityScore}/100
- Keywords: ${resume.keywordScore}/100
- Experience: ${resume.experienceScore}/100
- Overall: ${resume.overallScore}/100
- Weak Areas: ${resume.weakAreas.join(', ')}

Generate 3-5 detailed paragraphs of professional feedback. Focus on:
1. Strengths to maintain
2. Critical areas to fix
3. Quick wins (2 hours of effort)
4. Long-term improvements
5. Industry-specific advice

Return as JSON: { "feedback": "full feedback text", "quickWins": string[], "longTermGoals": string[] }
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async getResume(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) throw new NotFoundException('No resume found for this user');
    return resume;
  }
}
