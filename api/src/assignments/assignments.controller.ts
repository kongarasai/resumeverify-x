import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, AssignmentType } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  AssignmentsService,
  CreateAssignmentDto,
  SubmitAssignmentDto,
  GenerateQuestionsDto,
} from './assignments.service';

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.MENTOR, Role.UNIVERSITY_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new assignment (Teacher only)' })
  create(
    @CurrentUser('id') teacherId: string,
    @Body() dto: CreateAssignmentDto,
  ) {
    return this.assignmentsService.createAssignment(teacherId, dto);
  }

  @Post(':id/publish')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.MENTOR, Role.UNIVERSITY_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Publish an assignment' })
  publish(@CurrentUser('id') teacherId: string, @Param('id') id: string) {
    return this.assignmentsService.publishAssignment(teacherId, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get assignments with filters' })
  @ApiQuery({ name: 'groupId', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: AssignmentType })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAll(
    @Query('groupId') groupId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('type') type?: AssignmentType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.assignmentsService.getAssignments({ groupId, teacherId, type, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  getById(@Param('id') id: string) {
    return this.assignmentsService.getAssignmentById(id);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit assignment solution' })
  submit(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.assignmentsService.submitAssignment(userId, id, dto);
  }

  @Post('generate-questions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.MENTOR, Role.UNIVERSITY_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Generate questions using AI' })
  generateQuestions(@Body() dto: GenerateQuestionsDto) {
    return this.assignmentsService.generateQuestions(dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER, Role.MENTOR, Role.UNIVERSITY_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an assignment' })
  delete(@CurrentUser('id') teacherId: string, @Param('id') id: string) {
    return this.assignmentsService.deleteAssignment(teacherId, id);
  }
}
