import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: any) {
    return this.jobsService.createJob(body);
  }

  @Get()
  search(@Query('q') q: string, @Query('type') type: string) {
    return this.jobsService.searchJobs(q, type);
  }

  @Get('applications')
  myApplications(@Request() req: any) {
    return this.jobsService.getApplicationsByUser(req.user.id);
  }

  @Get('kanban')
  kanban(@Request() req: any) {
    return this.jobsService.getKanbanBoard(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post(':id/apply')
  apply(@Param('id') id: string, @Request() req: any, @Body('coverLetter') coverLetter?: string) {
    return this.jobsService.applyJob(id, req.user.id, coverLetter);
  }

  @Patch('pipeline/:applicationId/stage')
  updateStage(
    @Param('applicationId') applicationId: string,
    @Request() req: any,
    @Body('stage') stage: string,
    @Body('notes') notes?: string,
  ) {
    return this.jobsService.updatePipelineStage(applicationId, req.user.id, stage, notes);
  }
}
