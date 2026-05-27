import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResumeService } from './resume.service';
import { diskStorage } from 'multer';
import * as path from 'path';

class UploadResumeDto {
  @ApiPropertyOptional({ description: 'Parsed text content of resume' })
  @IsOptional()
  @IsString()
  parsedText?: string;
}

class AnalyzeResumeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;
}

@ApiTags('Resume')
@Controller('resume')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload resume file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        parsedText: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx', '.txt'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF, DOC, DOCX, and TXT files are allowed'), false);
        }
      },
    }),
  )
  async uploadResume(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadResumeDto,
  ) {
    const fileUrl = file
      ? `/uploads/resumes/${file.filename}`
      : '';

    return this.resumeService.uploadResume(userId, fileUrl, dto.parsedText);
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze resume using AI' })
  analyzeMyResume(@CurrentUser('id') userId: string) {
    return this.resumeService.analyzeResume(userId);
  }

  @Post('analyze/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze resume for specific user (admin/recruiter)' })
  analyzeResume(@Param('userId') userId: string) {
    return this.resumeService.analyzeResume(userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my resume' })
  getMyResume(@CurrentUser('id') userId: string) {
    return this.resumeService.getResume(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get resume of a user' })
  getResume(@Param('userId') userId: string) {
    return this.resumeService.getResume(userId);
  }

  @Get('me/feedback')
  @ApiOperation({ summary: 'Generate detailed AI feedback for my resume' })
  getFeedback(@CurrentUser('id') userId: string) {
    return this.resumeService.generateFeedback(userId);
  }

  @Post('parse')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parse resume text to extract structured data' })
  parseText(@Body('text') text: string) {
    if (!text) throw new BadRequestException('text is required');
    return this.resumeService.parseResumeText(text);
  }
}
