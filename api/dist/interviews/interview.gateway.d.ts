import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    userName?: string;
}
export declare class InterviewGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private config;
    private prisma;
    server: Server;
    private readonly logger;
    private roomParticipants;
    constructor(jwtService: JwtService, config: ConfigService, prisma: PrismaService);
    afterInit(server: Server): void;
    handleConnection(client: AuthenticatedSocket): void;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        roomCode: string;
    }): Promise<void>;
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        roomCode: string;
    }): void;
    handleCodeChange(client: AuthenticatedSocket, data: {
        roomCode: string;
        code: string;
        language: string;
        cursorPosition?: {
            line: number;
            column: number;
        };
    }): void;
    handleWhiteboardUpdate(client: AuthenticatedSocket, data: {
        roomCode: string;
        drawData: unknown;
        action: 'draw' | 'erase' | 'clear';
    }): void;
    handleChatMessage(client: AuthenticatedSocket, data: {
        roomCode: string;
        message: string;
        type?: 'text' | 'code' | 'system';
    }): void;
    handleIntegrityEvent(client: AuthenticatedSocket, data: {
        roomCode: string;
        event: 'tab_switch' | 'focus_loss' | 'copy_paste' | 'suspicious_activity';
        metadata?: Record<string, unknown>;
    }): Promise<void>;
    handleWebRTCOffer(client: AuthenticatedSocket, data: {
        roomCode: string;
        offer: unknown;
        targetUserId: string;
    }): void;
    handleWebRTCAnswer(client: AuthenticatedSocket, data: {
        roomCode: string;
        answer: unknown;
        targetUserId: string;
    }): void;
    handleICECandidate(client: AuthenticatedSocket, data: {
        roomCode: string;
        candidate: unknown;
    }): void;
}
export {};
