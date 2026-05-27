// ResumeVerify X™ — AI Report Service (NestJS + OpenAI)
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OpenAI } from 'openai';

@Injectable()
export class AiReportService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateCareerRoadmap(candidateId: string, targetRole: string, targetCompany: string) {
    const candidate = await this.prisma.candidates.findUnique({
      where: { id: candidateId },
      include: { trust_scores: { orderBy: { calculated_at: 'desc' }, take: 1 } }
    });

    const prompt = `
      Generate a personalized 3-month career roadmap for a candidate targeting ${targetRole} at ${targetCompany}.
      Current Trust Score: ${candidate.trust_scores[0]?.total_score || 0}
      Target: ${targetRole} at ${targetCompany}
      
      Return JSON with: { weeks: [{week, tasks, focus_area, expected_outcome}], milestones, weak_areas, recommended_resources }
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const roadmap = JSON.parse(response.choices[0].message.content);
    await this.prisma.ai_reports.create({
      data: {
        candidate_id: candidateId,
        report_type: 'career_roadmap',
        content: roadmap,
        model_used: 'gpt-4o',
        tokens_used: response.usage.total_tokens
      }
    });
    return roadmap;
  }

  async generateAISchedule(candidateId: string, preferences: {
    freeTime: string[], sleepTime: string, collegeTime: string
  }) {
    const prompt = `
      Create a daily study schedule for a candidate preparing for software engineering interviews.
      Free time slots: ${preferences.freeTime.join(', ')}
      College: ${preferences.collegeTime}
      Sleep: ${preferences.sleepTime}
      Include: DSA practice, system design, mock interviews, GitHub commits.
      Return JSON schedule by time slots.
    `;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0].message.content);
  }

  async generateQuestions(topic: string, subject: string, difficulty: string, count: number, type: string) {
    const prompt = `
      Generate ${count} ${type} questions on "${topic}" from "${subject}".
      Difficulty: ${difficulty}
      Include: question, options (if MCQ), correct_answer, explanation, marks.
      Return JSON array of questions.
    `;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0].message.content);
  }

  async analyzeInterview(roomId: string) {
    const room = await this.prisma.interview_rooms.findUnique({ where: { id: roomId } });
    if (!room?.transcript) return null;

    const prompt = `
      Analyze this interview transcript and provide:
      1. Communication score (0-100)
      2. Technical depth score (0-100)
      3. Key strengths (array)
      4. Areas for improvement (array)
      5. Hiring recommendation (strong_yes/yes/maybe/no)
      6. Summary paragraph
      
      Transcript: ${room.transcript.substring(0, 4000)}
      Return JSON.
    `;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0].message.content);
  }
}
