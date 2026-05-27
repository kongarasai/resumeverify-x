import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AssignmentType } from '@prisma/client';
import OpenAI from 'openai';
import {
  IsString, IsEnum, IsOptional, IsDateString, IsInt,
  IsBoolean, Min, Max, IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: AssignmentType })
  @IsEnum(AssignmentType)
  type: AssignmentType;

  @ApiPropertyOptional({ default: 'MEDIUM' })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  totalMarks?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class SubmitAssignmentDto {
  @ApiProperty({ description: 'Solution code or text' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Programming language' })
  @IsString()
  @IsNotEmpty()
  language: string;
}

export class GenerateQuestionsDto {
  @ApiProperty({ description: 'Topic for question generation' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ enum: AssignmentType })
  @IsEnum(AssignmentType)
  type: AssignmentType;

  @ApiPropertyOptional({ default: 'MEDIUM' })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  count?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subject?: string;
}

@Injectable()
export class AssignmentsService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async createAssignment(teacherId: string, dto: CreateAssignmentDto) {
    const assignment = await this.prisma.assignment.create({
      data: {
        teacherId,
        title: dto.title,
        description: dto.description,
        type: dto.type,
        difficulty: dto.difficulty || 'MEDIUM',
        topic: dto.topic,
        subject: dto.subject,
        totalMarks: dto.totalMarks || 100,
        groupId: dto.groupId || null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        isPublished: false,
      },
      include: {
        teacher: { select: { id: true, name: true } },
        group: { select: { id: true, name: true } },
      },
    });

    return { assignment, message: 'Assignment created successfully' };
  }

  async publishAssignment(teacherId: string, assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) throw new NotFoundException('Assignment not found');
    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException('You can only publish your own assignments');
    }

    const updated = await this.prisma.assignment.update({
      where: { id: assignmentId },
      data: { isPublished: true },
    });

    return { assignment: updated, message: 'Assignment published successfully' };
  }

  async getAssignments(filters: {
    groupId?: string;
    teacherId?: string;
    type?: AssignmentType;
    isPublished?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20, ...where } = filters;
    const skip = (page - 1) * limit;

    const [assignments, total] = await this.prisma.$transaction([
      this.prisma.assignment.findMany({
        where: {
          ...(where.groupId && { groupId: where.groupId }),
          ...(where.teacherId && { teacherId: where.teacherId }),
          ...(where.type && { type: where.type }),
          ...(where.isPublished !== undefined && { isPublished: where.isPublished }),
        },
        include: {
          teacher: { select: { id: true, name: true, avatarUrl: true } },
          group: { select: { id: true, name: true } },
          _count: { select: { submissions: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.assignment.count({
        where: {
          ...(where.groupId && { groupId: where.groupId }),
          ...(where.teacherId && { teacherId: where.teacherId }),
        },
      }),
    ]);

    return { assignments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAssignmentById(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true, avatarUrl: true } },
        group: { select: { id: true, name: true } },
        _count: { select: { submissions: true } },
      },
    });

    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async submitAssignment(userId: string, assignmentId: string, dto: SubmitAssignmentDto) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) throw new NotFoundException('Assignment not found');
    if (!assignment.isPublished) throw new ForbiddenException('Assignment is not yet published');

    const submission = await this.prisma.codingSubmission.create({
      data: {
        userId,
        assignmentId,
        code: dto.code,
        language: dto.language,
        status: 'PENDING',
      },
    });

    return { submission, message: 'Submission received successfully' };
  }

  async generateQuestions(dto: GenerateQuestionsDto) {
    const typePrompts: Record<string, string> = {
      MCQ: 'multiple-choice questions with 4 options and one correct answer',
      CODING: 'coding problems with problem statement, constraints, examples, and test cases',
      SQL: 'SQL query problems with schema and expected output',
      APTITUDE: 'aptitude/reasoning questions with solutions',
      QUIZ: 'quiz questions with answers',
      DEBUGGING: 'buggy code snippets with the bug identified and fixed solution',
      SUBJECTIVE: 'subjective/open-ended questions with model answers',
    };

    const questionFormat = typePrompts[dto.type] || 'questions with answers';

    const prompt = `
Generate ${dto.count || 10} ${dto.difficulty || 'MEDIUM'} difficulty ${questionFormat} 
on the topic: "${dto.topic}"
${dto.subject ? `Subject: ${dto.subject}` : ''}

Return ONLY valid JSON array with exactly this structure:
[
  {
    "question": "question text",
    "options": ["A", "B", "C", "D"],  // empty array for non-MCQ
    "answer": "correct answer or explanation",
    "explanation": "why this is correct",
    "marks": 5,
    "tags": ["tag1", "tag2"],
    "difficulty": "${dto.difficulty || 'MEDIUM'}"
  }
]
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    let result: any;
    try {
      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      result = parsed.questions || parsed.items || Object.values(parsed)[0] || [];
    } catch {
      result = [];
    }

    // Store in DB
    for (const q of result) {
      await this.prisma.question.create({
        data: {
          topic: dto.topic,
          subject: dto.subject,
          difficulty: dto.difficulty || 'MEDIUM',
          type: dto.type,
          question: q.question,
          options: q.options || [],
          answer: q.answer || '',
          explanation: q.explanation || '',
          marks: q.marks || 1,
          tags: q.tags || [],
          isPublic: false,
        },
      });
    }

    return {
      questions: result,
      count: result.length,
      topic: dto.topic,
      type: dto.type,
    };
  }

  async deleteAssignment(teacherId: string, assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) throw new NotFoundException('Assignment not found');
    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own assignments');
    }

    await this.prisma.assignment.delete({ where: { id: assignmentId } });
    return { message: 'Assignment deleted successfully' };
  }
}
