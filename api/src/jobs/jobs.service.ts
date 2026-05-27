import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async createJob(data: any) {
    return this.prisma.job.create({ data });
  }

  async searchJobs(query: string, type?: string) {
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

  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async applyJob(jobId: string, userId: string, coverLetter?: string) {
    return this.prisma.jobApplication.upsert({
      where: { jobId_userId: { jobId, userId } },
      update: { coverLetter },
      create: { jobId, userId, coverLetter },
    });
  }

  async getApplicationsByUser(userId: string) {
    return this.prisma.jobApplication.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async getKanbanBoard(recruiterId: string) {
    const pipelines = await this.prisma.candidatePipeline.findMany({
      where: { recruiterId },
      include: {
        application: { include: { job: true, user: { include: { trustScore: true } } } },
      },
      orderBy: { movedAt: 'desc' },
    });

    const stages = ['APPLIED','SCREENING','ASSESSMENT','HR_ROUND','TECHNICAL_ROUND','FINAL_ROUND','OFFER','HIRED','REJECTED'];
    const board: Record<string, any[]> = {};
    stages.forEach(s => board[s] = []);
    pipelines.forEach(p => {
      if (board[p.stage]) board[p.stage].push(p);
    });
    return board;
  }

  async updatePipelineStage(applicationId: string, recruiterId: string, stage: string, notes?: string) {
    return this.prisma.candidatePipeline.upsert({
      where: { id: applicationId },
      update: { stage: stage as any, notes, movedAt: new Date() },
      create: { applicationId, recruiterId, stage: stage as any, notes },
    });
  }
}
