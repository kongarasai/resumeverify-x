import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private messagesService;
    private jwtService;
    server: Server;
    private onlineUsers;
    constructor(messagesService: MessagesService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSendMessage(data: {
        receiverId?: string;
        groupId?: string;
        content: string;
        type?: string;
    }, client: Socket): Promise<{
        sender: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        fileUrl: string | null;
        content: string;
        groupId: string | null;
        isPinned: boolean;
        isRead: boolean;
        senderId: string;
        receiverId: string | null;
    }>;
    handleTyping(data: {
        receiverId: string;
        isTyping: boolean;
    }, client: Socket): void;
    handleJoinGroup(groupId: string, client: Socket): void;
    handleReadReceipt(messageId: string): Promise<void>;
}
