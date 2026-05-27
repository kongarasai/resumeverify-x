import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    sendMessage(senderId: string, receiverId: string | null, groupId: string | null, content: string, type?: string, fileUrl?: string): Promise<{
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
    getDirectMessages(userId1: string, userId2: string): Promise<({
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
    })[]>;
    getGroupMessages(groupId: string): Promise<({
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
    })[]>;
    pinMessage(messageId: string): Promise<{
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
    markAsRead(messageId: string): Promise<{
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
    getConversationList(userId: string): Promise<({
        sender: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        receiver: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
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
    })[]>;
}
