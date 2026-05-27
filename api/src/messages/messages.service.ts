import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, receiverId: string | null, groupId: string | null, content: string, type = 'TEXT', fileUrl?: string) {
    return this.prisma.message.create({
      data: { senderId, receiverId, groupId, content, type: type as any, fileUrl },
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async getDirectMessages(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getGroupMessages(groupId: string) {
    return this.prisma.message.findMany({
      where: { groupId },
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async pinMessage(messageId: string) {
    return this.prisma.message.update({ where: { id: messageId }, data: { isPinned: true } });
  }

  async markAsRead(messageId: string) {
    return this.prisma.message.update({ where: { id: messageId }, data: { isRead: true } });
  }

  async getConversationList(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['senderId', 'receiverId'],
    });
    return messages;
  }
}
