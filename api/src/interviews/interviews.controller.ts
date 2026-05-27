import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  InterviewsService,
  CreateInterviewRoomDto,
  ScorecardDto,
} from './interviews.service';
import { InterviewType } from '@prisma/client';

@ApiTags('Interviews')
@Controller('interviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('rooms')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create interview room' })
  createRoom(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateInterviewRoomDto,
  ) {
    return this.interviewsService.createRoom(userId, dto);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get all interview rooms' })
  @ApiQuery({ name: 'isLive', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false, enum: InterviewType })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getRooms(
    @Query('isLive') isLive?: boolean,
    @Query('type') type?: InterviewType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.interviewsService.getRooms({ isLive, type, page, limit });
  }

  @Get('rooms/:id')
  @ApiOperation({ summary: 'Get room by ID' })
  getRoomById(@Param('id') id: string) {
    return this.interviewsService.getRoomById(id);
  }

  @Post('rooms/:roomCode/join')
  @ApiOperation({ summary: 'Join interview room by room code' })
  joinRoom(@CurrentUser('id') userId: string, @Param('roomCode') roomCode: string) {
    return this.interviewsService.joinRoom(userId, roomCode);
  }

  @Post('rooms/:id/end')
  @ApiOperation({ summary: 'End an interview room' })
  endRoom(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.interviewsService.endRoom(userId, id);
  }

  @Post('rooms/:id/scorecard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save interview scorecard' })
  saveScorecard(@Param('id') id: string, @Body() dto: ScorecardDto) {
    return this.interviewsService.saveScorecard(id, dto);
  }

  @Get('rooms/:id/recordings')
  @ApiOperation({ summary: 'Get interview recordings' })
  getRecordings(@Param('id') id: string) {
    return this.interviewsService.getRecordings(id);
  }
}
