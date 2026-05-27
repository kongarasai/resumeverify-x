import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    conversations(req: any): Promise<({
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
    direct(userId: string, req: any): Promise<({
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
    group(groupId: string): Promise<({
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
    send(req: any, body: {
        receiverId?: string;
        groupId?: string;
        content: string;
        type?: string;
        fileUrl?: string;
    }): Promise<{
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
}
