import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InterviewType } from '@prisma/client';
import {
  IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInterviewRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: InterviewType })
  @IsEnum(InterviewType)
  type: InterviewType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  hasVideo?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasWhiteboard?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  hasCodeEditor?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  recordingEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  candidateId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interviewerId?: string;
}

export class ScorecardDto {
  @ApiProperty()
  technicalScore: number;

  @ApiProperty()
  communicationScore: number;

  @ApiProperty()
  problemSolving: number;

  @ApiProperty()
  cultureFit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'HIRE, REJECT, MAYBE' })
  @IsOptional()
  @IsString()
  recommendation?: string;
}

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(creatorId: string, dto: CreateInterviewRoomDto) {
    const room = await this.prisma.interviewRoom.create({
      data: {
        title: dto.title,
        type: dto.type,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        hasVideo: dto.hasVideo ?? true,
        hasWhiteboard: dto.hasWhiteboard ?? false,
        hasCodeEditor: dto.hasCodeEditor ?? true,
        recordingEnabled: dto.recordingEnabled ?? false,
        participants: {
          create: [
            ...(dto.candidateId
              ? [{ candidateId: dto.candidateId, panelRole: 'CANDIDATE' }]
              : []),
            ...(dto.interviewerId
              ? [{ interviewerId: dto.interviewerId, panelRole: 'INTERVIEWER' }]
              : []),
          ],
        },
      },
      include: {
        participants: {
          include: {
            candidate: { select: { id: true, name: true, email: true } },
            interviewer: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return { room, message: 'Interview room created successfully' };
  }

  async joinRoom(userId: string, roomCode: string) {
    const room = await this.prisma.interviewRoom.findUnique({
      where: { roomCode },
      include: {
        participants: {
          include: {
            candidate: { select: { id: true, name: true, avatarUrl: true } },
            interviewer: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        scorecards: true,
      },
    });

    if (!room) throw new NotFoundException('Interview room not found');

    // Mark join time
    await this.prisma.interviewParticipant.updateMany({
      where: { roomId: room.id, candidateId: userId },
      data: { joinedAt: new Date() },
    });

    return { room };
  }

  async endRoom(userId: string, roomId: string) {
    const room = await this.prisma.interviewRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const updated = await this.prisma.interviewRoom.update({
      where: { id: roomId },
      data: {
        isLive: false,
        endedAt: new Date(),
      },
    });

    // Mark all participants as left
    await this.prisma.interviewParticipant.updateMany({
      where: { roomId, leftAt: null },
      data: { leftAt: new Date() },
    });

    return { room: updated, message: 'Interview ended successfully' };
  }

  async saveScorecard(roomId: string, dto: ScorecardDto) {
    const room = await this.prisma.interviewRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const overallScore =
      (dto.technicalScore + dto.communicationScore + dto.problemSolving + dto.cultureFit) / 4;

    const scorecard = await this.prisma.interviewScorecard.create({
      data: {
        roomId,
        technicalScore: dto.technicalScore,
        communicationScore: dto.communicationScore,
        problemSolving: dto.problemSolving,
        cultureFit: dto.cultureFit,
        overallScore,
        notes: dto.notes,
        recommendation: dto.recommendation,
      },
    });

    // Update integrity score on room
    await this.prisma.interviewRoom.update({
      where: { id: roomId },
      data: { integrityScore: overallScore },
    });

    return { scorecard, message: 'Scorecard saved successfully' };
  }

  async getRecordings(roomId: string) {
    const room = await this.prisma.interviewRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const recordings = await this.prisma.interviewRecording.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
    });

    return { recordings };
  }

  async getRooms(filters: { isLive?: boolean; type?: InterviewType; page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const [rooms, total] = await this.prisma.$transaction([
      this.prisma.interviewRoom.findMany({
        where: {
          ...(filters.isLive !== undefined && { isLive: filters.isLive }),
          ...(filters.type && { type: filters.type }),
        },
        include: {
          participants: {
            include: {
              candidate: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
          _count: { select: { recordings: true, scorecards: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.interviewRoom.count(),
    ]);

    return { rooms, total, page, limit };
  }

  async getRoomById(id: string) {
    const room = await this.prisma.interviewRoom.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            candidate: { select: { id: true, name: true, email: true, avatarUrl: true } },
            interviewer: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        scorecards: true,
        recordings: true,
      },
    });

    if (!room) throw new NotFoundException('Room not found');
    return room;
  }
}
