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
exports.InterviewsService = exports.ScorecardDto = exports.CreateInterviewRoomDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateInterviewRoomDto {
    title;
    type;
    scheduledAt;
    hasVideo;
    hasWhiteboard;
    hasCodeEditor;
    recordingEnabled;
    candidateId;
    interviewerId;
}
exports.CreateInterviewRoomDto = CreateInterviewRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInterviewRoomDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.InterviewType }),
    (0, class_validator_1.IsEnum)(client_1.InterviewType),
    __metadata("design:type", String)
], CreateInterviewRoomDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInterviewRoomDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInterviewRoomDto.prototype, "hasVideo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInterviewRoomDto.prototype, "hasWhiteboard", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInterviewRoomDto.prototype, "hasCodeEditor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInterviewRoomDto.prototype, "recordingEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterviewRoomDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterviewRoomDto.prototype, "interviewerId", void 0);
class ScorecardDto {
    technicalScore;
    communicationScore;
    problemSolving;
    cultureFit;
    notes;
    recommendation;
}
exports.ScorecardDto = ScorecardDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ScorecardDto.prototype, "technicalScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ScorecardDto.prototype, "communicationScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ScorecardDto.prototype, "problemSolving", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ScorecardDto.prototype, "cultureFit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScorecardDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HIRE, REJECT, MAYBE' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScorecardDto.prototype, "recommendation", void 0);
let InterviewsService = class InterviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRoom(creatorId, dto) {
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
    async joinRoom(userId, roomCode) {
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
        if (!room)
            throw new common_1.NotFoundException('Interview room not found');
        await this.prisma.interviewParticipant.updateMany({
            where: { roomId: room.id, candidateId: userId },
            data: { joinedAt: new Date() },
        });
        return { room };
    }
    async endRoom(userId, roomId) {
        const room = await this.prisma.interviewRoom.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const updated = await this.prisma.interviewRoom.update({
            where: { id: roomId },
            data: {
                isLive: false,
                endedAt: new Date(),
            },
        });
        await this.prisma.interviewParticipant.updateMany({
            where: { roomId, leftAt: null },
            data: { leftAt: new Date() },
        });
        return { room: updated, message: 'Interview ended successfully' };
    }
    async saveScorecard(roomId, dto) {
        const room = await this.prisma.interviewRoom.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const overallScore = (dto.technicalScore + dto.communicationScore + dto.problemSolving + dto.cultureFit) / 4;
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
        await this.prisma.interviewRoom.update({
            where: { id: roomId },
            data: { integrityScore: overallScore },
        });
        return { scorecard, message: 'Scorecard saved successfully' };
    }
    async getRecordings(roomId) {
        const room = await this.prisma.interviewRoom.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const recordings = await this.prisma.interviewRecording.findMany({
            where: { roomId },
            orderBy: { createdAt: 'desc' },
        });
        return { recordings };
    }
    async getRooms(filters) {
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
    async getRoomById(id) {
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
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map