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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JobsService = class JobsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createJob(data) {
        return this.prisma.job.create({ data });
    }
    async searchJobs(query, type) {
        return this.prisma.job.findMany({
            where: {
                isActive: true,
                ...(query && {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { company: { contains: query, mode: 'insensitive' } },
                    ],
                }),
                ...(type && { type }),
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getJobById(id) {
        const job = await this.prisma.job.findUnique({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return job;
    }
    async applyJob(jobId, userId, coverLetter) {
        return this.prisma.jobApplication.upsert({
            where: { jobId_userId: { jobId, userId } },
            update: { coverLetter },
            create: { jobId, userId, coverLetter },
        });
    }
    async getApplicationsByUser(userId) {
        return this.prisma.jobApplication.findMany({
            where: { userId },
            include: { job: true },
            orderBy: { appliedAt: 'desc' },
        });
    }
    async getKanbanBoard(recruiterId) {
        const pipelines = await this.prisma.candidatePipeline.findMany({
            where: { recruiterId },
            include: {
                application: { include: { job: true, user: { include: { trustScore: true } } } },
            },
            orderBy: { movedAt: 'desc' },
        });
        const stages = ['APPLIED', 'SCREENING', 'ASSESSMENT', 'HR_ROUND', 'TECHNICAL_ROUND', 'FINAL_ROUND', 'OFFER', 'HIRED', 'REJECTED'];
        const board = {};
        stages.forEach(s => board[s] = []);
        pipelines.forEach(p => {
            if (board[p.stage])
                board[p.stage].push(p);
        });
        return board;
    }
    async updatePipelineStage(applicationId, recruiterId, stage, notes) {
        return this.prisma.candidatePipeline.upsert({
            where: { id: applicationId },
            update: { stage: stage, notes, movedAt: new Date() },
            create: { applicationId, recruiterId, stage: stage, notes },
        });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map