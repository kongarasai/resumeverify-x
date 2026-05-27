// ResumeVerify X™ — Real-time Notifications Gateway
import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma.service';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL }, namespace: '/notifications' })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private userSocketMap = new Map<string, string[]>();

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      const existing = this.userSocketMap.get(userId) || [];
      this.userSocketMap.set(userId, [...existing, client.id]);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      const existing = this.userSocketMap.get(userId) || [];
      this.userSocketMap.set(userId, existing.filter(id => id !== client.id));
    }
  }

  async sendToUser(userId: string, notification: { title: string; body: string; type: string; metadata?: any }) {
    const socketIds = this.userSocketMap.get(userId) || [];
    socketIds.forEach(socketId => {
      this.server.to(socketId).emit('notification', notification);
    });
    // Save to DB
    await this.prisma.notifications.create({
      data: { user_id: userId, title: notification.title, body: notification.body, type: notification.type, metadata: notification.metadata }
    });
  }

  async broadcastToUniversity(universityId: string, notification: any) {
    const students = await this.prisma.candidates.findMany({ where: { university_id: universityId }, select: { user_id: true } });
    for (const s of students) {
      await this.sendToUser(s.user_id, notification);
    }
  }

  async sendTrustScoreUpdate(candidateId: string, newScore: number, oldScore: number) {
    const candidate = await this.prisma.candidates.findUnique({ where: { id: candidateId } });
    await this.sendToUser(candidate.user_id, {
      title: 'Trust Score Updated',
      body: `Your Trust Score changed from ${oldScore} to ${newScore} (${newScore > oldScore ? '+' : ''}${(newScore - oldScore).toFixed(1)} pts)`,
      type: 'trust_score_update',
      metadata: { newScore, oldScore, candidateId }
    });
  }
}
