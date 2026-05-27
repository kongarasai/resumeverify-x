import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('career-plan')
  careerPlan(@Body() body: { targetRole: string; targetCompany: string; weakSkills: string[]; currentScore: number }) {
    return this.aiService.generateCareerPlan(body.targetRole, body.targetCompany, body.weakSkills, body.currentScore);
  }

  @Post('daily-missions')
  dailyMissions(@Request() req: any, @Body() body: { weakSkills: string[]; streak: number }) {
    return this.aiService.generateDailyMissions(req.user.role, body.weakSkills, body.streak);
  }

  @Post('schedule')
  schedule(@Body() body: { freeTime: string; collegeTime: string; sleepTime: string; targetRole: string }) {
    return this.aiService.generateSchedule(body.freeTime, body.collegeTime, body.sleepTime, body.targetRole);
  }

  @Post('lesson-plan')
  lessonPlan(@Body() body: { topic: string; duration: string; audience: string }) {
    return this.aiService.generateLessonPlan(body.topic, body.duration, body.audience);
  }

  @Post('generate-questions')
  generateQuestions(@Body() body: { topic: string; difficulty: string; type: string; count: number }) {
    return this.aiService.generateQuestions(body.topic, body.difficulty, body.type, body.count);
  }

  @Post('company-prep')
  companyPrep(@Body() body: { company: string; role: string; currentSkills: string[] }) {
    return this.aiService.companyPreparationPlan(body.company, body.role, body.currentSkills);
  }

  @Post('salary-insights')
  salaryInsights(@Body() body: { role: string; skills: string[]; yearsOfExp: number }) {
    return this.aiService.analyzeSalaryTrends(body.role, body.skills, body.yearsOfExp);
  }
}
