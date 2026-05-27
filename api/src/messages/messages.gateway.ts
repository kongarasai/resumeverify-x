import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/messages' })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      this.onlineUsers.set(payload.sub, client.id);
      this.server.emit('user_online', { userId: payload.sub });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('user_offline', { userId });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { receiverId?: string; groupId?: string; content: string; type?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;
    const message = await this.messagesService.sendMessage(
      senderId, data.receiverId || null, data.groupId || null, data.content, data.type,
    );

    if (data.receiverId) {
      const receiverSocketId = this.onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', message);
      }
    } else if (data.groupId) {
      this.server.to(`group_${data.groupId}`).emit('new_message', message);
    }

    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { receiverId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const receiverSocketId = this.onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('typing', {
        userId: client.data.userId,
        isTyping: data.isTyping,
      });
    }
  }

  @SubscribeMessage('join_group')
  handleJoinGroup(@MessageBody() groupId: string, @ConnectedSocket() client: Socket) {
    client.join(`group_${groupId}`);
  }

  @SubscribeMessage('read_receipt')
  async handleReadReceipt(@MessageBody() messageId: string) {
    await this.messagesService.markAsRead(messageId);
    this.server.emit('message_read', { messageId });
  }
}
