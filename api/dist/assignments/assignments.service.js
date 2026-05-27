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
exports.AssignmentsService = exports.GenerateQuestionsDto = exports.SubmitAssignmentDto = exports.CreateAssignmentDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const openai_1 = __importDefault(require("openai"));
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAssignmentDto {
    title;
    description;
    type;
    difficulty;
    topic;
    subject;
    totalMarks;
    groupId;
    dueDate;
}
exports.CreateAssignmentDto = CreateAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AssignmentType }),
    (0, class_validator_1.IsEnum)(client_1.AssignmentType),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'MEDIUM' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], CreateAssignmentDto.prototype, "totalMarks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssignmentDto.prototype, "dueDate", void 0);
class SubmitAssignmentDto {
    code;
    language;
}
exports.SubmitAssignmentDto = SubmitAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Solution code or text' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitAssignmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Programming language' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitAssignmentDto.prototype, "language", void 0);
class GenerateQuestionsDto {
    topic;
    type;
    difficulty;
    count;
    subject;
}
exports.GenerateQuestionsDto = GenerateQuestionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Topic for question generation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AssignmentType }),
    (0, class_validator_1.IsEnum)(client_1.AssignmentType),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'MEDIUM' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], GenerateQuestionsDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "subject", void 0);
let AssignmentsService = class AssignmentsService {
    prisma;
    config;
    openai;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.openai = new openai_1.default({
            apiKey: this.config.get('OPENAI_API_KEY'),
        });
    }
    async createAssignment(teacherId, dto) {
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
    async publishAssignment(teacherId, assignmentId) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        if (assignment.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('You can only publish your own assignments');
        }
        const updated = await this.prisma.assignment.update({
            where: { id: assignmentId },
            data: { isPublished: true },
        });
        return { assignment: updated, message: 'Assignment published successfully' };
    }
    async getAssignments(filters) {
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
    async getAssignmentById(id) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
            include: {
                teacher: { select: { id: true, name: true, avatarUrl: true } },
                group: { select: { id: true, name: true } },
                _count: { select: { submissions: true } },
            },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        return assignment;
    }
    async submitAssignment(userId, assignmentId, dto) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        if (!assignment.isPublished)
            throw new common_1.ForbiddenException('Assignment is not yet published');
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
    async generateQuestions(dto) {
        const typePrompts = {
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
        let result;
        try {
            const parsed = JSON.parse(response.choices[0].message.content || '{}');
            result = parsed.questions || parsed.items || Object.values(parsed)[0] || [];
        }
        catch {
            result = [];
        }
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
    async deleteAssignment(teacherId, assignmentId) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        if (assignment.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('You can only delete your own assignments');
        }
        await this.prisma.assignment.delete({ where: { id: assignmentId } });
        return { message: 'Assignment deleted successfully' };
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map