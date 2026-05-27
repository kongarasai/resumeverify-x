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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InterviewGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let InterviewGateway = InterviewGateway_1 = class InterviewGateway {
    jwtService;
    config;
    prisma;
    server;
    logger = new common_1.Logger(InterviewGateway_1.name);
    roomParticipants = new Map();
    constructor(jwtService, config, prisma) {
        this.jwtService = jwtService;
        this.config = config;
        this.prisma = prisma;
    }
    afterInit(server) {
        this.logger.log('🎙️ Interview WebSocket Gateway initialized');
        server.use((socket, next) => {
            const token = socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                return next(new common_1.UnauthorizedException('Authentication token required'));
            }
            try {
                const payload = this.jwtService.verify(token, {
                    secret: this.config.get('JWT_SECRET'),
                });
                socket.userId = payload.sub;
                socket.userName = payload.email;
                next();
            }
            catch {
                next(new common_1.UnauthorizedException('Invalid or expired token'));
            }
        });
    }
    handleConnection(client) {
        this.logger.log(`✅ Interview client connected: ${client.id} (user: ${client.userId})`);
    }
    handleDisconnect(client) {
        this.logger.log(`❌ Interview client disconnected: ${client.id}`);
        this.roomParticipants.forEach((participants, roomId) => {
            if (participants.has(client.userId)) {
                participants.delete(client.userId);
                client.to(roomId).emit('participant_left', {
                    userId: client.userId,
                    userName: client.userName,
                    roomId,
                });
            }
        });
    }
    async handleJoinRoom(client, data) {
        const { roomCode } = data;
        const room = await this.prisma.interviewRoom.findUnique({
            where: { roomCode },
            include: { participants: true },
        });
        if (!room) {
            client.emit('error', { message: 'Room not found' });
            return;
        }
        client.join(roomCode);
        if (!this.roomParticipants.has(roomCode)) {
            this.roomParticipants.set(roomCode, new Set());
        }
        this.roomParticipants.get(roomCode).add(client.userId);
        if (!room.isLive) {
            await this.prisma.interviewRoom.update({
                where: { id: room.id },
                data: { isLive: true, startedAt: new Date() },
            });
        }
        client.to(roomCode).emit('participant_joined', {
            userId: client.userId,
            userName: client.userName,
            roomCode,
            timestamp: new Date().toISOString(),
        });
        client.emit('room_joined', {
            roomCode,
            roomId: room.id,
            title: room.title,
            type: room.type,
            hasVideo: room.hasVideo,
            hasWhiteboard: room.hasWhiteboard,
            hasCodeEditor: room.hasCodeEditor,
            participants: Array.from(this.roomParticipants.get(roomCode) || []),
        });
        this.logger.log(`User ${client.userId} joined interview room: ${roomCode}`);
    }
    handleLeaveRoom(client, data) {
        const { roomCode } = data;
        client.leave(roomCode);
        const participants = this.roomParticipants.get(roomCode);
        if (participants) {
            participants.delete(client.userId);
        }
        client.to(roomCode).emit('participant_left', {
            userId: client.userId,
            userName: client.userName,
            roomCode,
            timestamp: new Date().toISOString(),
        });
        client.emit('room_left', { roomCode });
    }
    handleCodeChange(client, data) {
        client.to(data.roomCode).emit('code_update', {
            userId: client.userId,
            code: data.code,
            language: data.language,
            cursorPosition: data.cursorPosition,
            timestamp: new Date().toISOString(),
        });
    }
    handleWhiteboardUpdate(client, data) {
        client.to(data.roomCode).emit('whiteboard_change', {
            userId: client.userId,
            drawData: data.drawData,
            action: data.action,
            timestamp: new Date().toISOString(),
        });
    }
    handleChatMessage(client, data) {
        const payload = {
            id: `${Date.now()}-${client.userId}`,
            userId: client.userId,
            userName: client.userName,
            message: data.message,
            type: data.type || 'text',
            timestamp: new Date().toISOString(),
        };
        this.server.to(data.roomCode).emit('new_chat_message', payload);
    }
    async handleIntegrityEvent(client, data) {
        this.logger.warn(`Integrity event: ${data.event} by user ${client.userId} in room ${data.roomCode}`);
        const room = await this.prisma.interviewRoom.findUnique({
            where: { roomCode: data.roomCode },
            select: { id: true },
        });
        if (room) {
            const updateData = {};
            if (data.event === 'tab_switch') {
                await this.prisma.interviewParticipant.updateMany({
                    where: { roomId: room.id, candidateId: client.userId },
                    data: { tabSwitches: { increment: 1 } },
                });
            }
            else if (data.event === 'focus_loss') {
                await this.prisma.interviewParticipant.updateMany({
                    where: { roomId: room.id, candidateId: client.userId },
                    data: { focusLossCount: { increment: 1 } },
                });
            }
            else if (data.event === 'copy_paste') {
                await this.prisma.interviewParticipant.updateMany({
                    where: { roomId: room.id, candidateId: client.userId },
                    data: { copyPasteCount: { increment: 1 } },
                });
            }
        }
        client.to(data.roomCode).emit('integrity_alert', {
            userId: client.userId,
            event: data.event,
            metadata: data.metadata,
            timestamp: new Date().toISOString(),
        });
    }
    handleWebRTCOffer(client, data) {
        client.to(data.roomCode).emit('webrtc_offer', {
            offer: data.offer,
            fromUserId: client.userId,
        });
    }
    handleWebRTCAnswer(client, data) {
        client.to(data.roomCode).emit('webrtc_answer', {
            answer: data.answer,
            fromUserId: client.userId,
        });
    }
    handleICECandidate(client, data) {
        client.to(data.roomCode).emit('webrtc_ice_candidate', {
            candidate: data.candidate,
            fromUserId: client.userId,
        });
    }
};
exports.InterviewGateway = InterviewGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], InterviewGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InterviewGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('code_change'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewGateway.prototype, "handleCodeChange", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('whiteboard_update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewGateway.prototype, "handleWhiteboardUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewGateway.prototype, "handleChatMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('integrity_event'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InterviewGateway.prototype, "handleIntegrityEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc_offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewGateway.prototype, "handleWebRTCOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc_answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewGateway.prototype, "handleWebRTCAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc_ice_candidate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewGateway.prototype, "handleICECandidate", null);
exports.InterviewGateway = InterviewGateway = InterviewGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/interview',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], InterviewGateway);
//# sourceMappingURL=interview.gateway.js.map