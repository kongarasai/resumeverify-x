import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/interview',
})
export class InterviewGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(InterviewGateway.name);
  private roomParticipants = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('🎙️ Interview WebSocket Gateway initialized');

    // JWT Authentication middleware
    server.use((socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new UnauthorizedException('Authentication token required'));
      }

      try {
        const payload = this.jwtService.verify(token, {
          secret: this.config.get<string>('JWT_SECRET'),
        });
        socket.userId = payload.sub;
        socket.userName = payload.email;
        next();
      } catch {
        next(new UnauthorizedException('Invalid or expired token'));
      }
    });
  }

  handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`✅ Interview client connected: ${client.id} (user: ${client.userId})`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`❌ Interview client disconnected: ${client.id}`);

    // Clean up from all rooms
    this.roomParticipants.forEach((participants, roomId) => {
      if (participants.has(client.userId!)) {
        participants.delete(client.userId!);
        client.to(roomId).emit('participant_left', {
          userId: client.userId,
          userName: client.userName,
          roomId,
        });
      }
    });
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomCode: string },
  ) {
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
    this.roomParticipants.get(roomCode)!.add(client.userId!);

    // Mark as live if first join
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

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomCode: string },
  ) {
    const { roomCode } = data;
    client.leave(roomCode);

    const participants = this.roomParticipants.get(roomCode);
    if (participants) {
      participants.delete(client.userId!);
    }

    client.to(roomCode).emit('participant_left', {
      userId: client.userId,
      userName: client.userName,
      roomCode,
      timestamp: new Date().toISOString(),
    });

    client.emit('room_left', { roomCode });
  }

  @SubscribeMessage('code_change')
  handleCodeChange(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: {
      roomCode: string;
      code: string;
      language: string;
      cursorPosition?: { line: number; column: number };
    },
  ) {
    client.to(data.roomCode).emit('code_update', {
      userId: client.userId,
      code: data.code,
      language: data.language,
      cursorPosition: data.cursorPosition,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('whiteboard_update')
  handleWhiteboardUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: {
      roomCode: string;
      drawData: unknown;
      action: 'draw' | 'erase' | 'clear';
    },
  ) {
    client.to(data.roomCode).emit('whiteboard_change', {
      userId: client.userId,
      drawData: data.drawData,
      action: data.action,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('chat_message')
  handleChatMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: {
      roomCode: string;
      message: string;
      type?: 'text' | 'code' | 'system';
    },
  ) {
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

  @SubscribeMessage('integrity_event')
  async handleIntegrityEvent(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: {
      roomCode: string;
      event: 'tab_switch' | 'focus_loss' | 'copy_paste' | 'suspicious_activity';
      metadata?: Record<string, unknown>;
    },
  ) {
    this.logger.warn(
      `Integrity event: ${data.event} by user ${client.userId} in room ${data.roomCode}`,
    );

    const room = await this.prisma.interviewRoom.findUnique({
      where: { roomCode: data.roomCode },
      select: { id: true },
    });

    if (room) {
      const updateData: Record<string, unknown> = {};
      if (data.event === 'tab_switch') {
        await this.prisma.interviewParticipant.updateMany({
          where: { roomId: room.id, candidateId: client.userId },
          data: { tabSwitches: { increment: 1 } },
        });
      } else if (data.event === 'focus_loss') {
        await this.prisma.interviewParticipant.updateMany({
          where: { roomId: room.id, candidateId: client.userId },
          data: { focusLossCount: { increment: 1 } },
        });
      } else if (data.event === 'copy_paste') {
        await this.prisma.interviewParticipant.updateMany({
          where: { roomId: room.id, candidateId: client.userId },
          data: { copyPasteCount: { increment: 1 } },
        });
      }
    }

    // Notify interviewers
    client.to(data.roomCode).emit('integrity_alert', {
      userId: client.userId,
      event: data.event,
      metadata: data.metadata,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('webrtc_offer')
  handleWebRTCOffer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomCode: string; offer: unknown; targetUserId: string },
  ) {
    client.to(data.roomCode).emit('webrtc_offer', {
      offer: data.offer,
      fromUserId: client.userId,
    });
  }

  @SubscribeMessage('webrtc_answer')
  handleWebRTCAnswer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomCode: string; answer: unknown; targetUserId: string },
  ) {
    client.to(data.roomCode).emit('webrtc_answer', {
      answer: data.answer,
      fromUserId: client.userId,
    });
  }

  @SubscribeMessage('webrtc_ice_candidate')
  handleICECandidate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomCode: string; candidate: unknown },
  ) {
    client.to(data.roomCode).emit('webrtc_ice_candidate', {
      candidate: data.candidate,
      fromUserId: client.userId,
    });
  }
}
