// ResumeVerify X™ — WebSocket Gateway for Live Interviews (NestJS + Socket.IO)
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL }, namespace: '/interview' })
export class InterviewGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Interview client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Interview client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { roomId: string; userId: string; role: string }, @ConnectedSocket() client: Socket) {
    client.join(data.roomId);
    client.to(data.roomId).emit('user-joined', { userId: data.userId, role: data.role });
    return { status: 'joined', roomId: data.roomId };
  }

  @SubscribeMessage('code-change')
  handleCodeChange(@MessageBody() data: { roomId: string; code: string; cursor: any }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('code-update', { code: data.code, cursor: data.cursor });
  }

  @SubscribeMessage('run-code')
  async handleRunCode(@MessageBody() data: { roomId: string; code: string; language: string; testCases: any[] }, @ConnectedSocket() client: Socket) {
    // Send to Judge0 API for execution
    client.to(data.roomId).emit('code-running', { message: 'Executing...' });
    // Judge0 response would come back here
    client.to(data.roomId).emit('code-result', { output: '3/3 passed', runtime: '48ms' });
  }

  @SubscribeMessage('whiteboard-draw')
  handleWhiteboardDraw(@MessageBody() data: { roomId: string; elements: any[] }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('whiteboard-update', { elements: data.elements });
  }

  @SubscribeMessage('scorecard-update')
  handleScorecardUpdate(@MessageBody() data: { roomId: string; scores: any; notes: string }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('scorecard-synced', data);
  }

  @SubscribeMessage('integrity-alert')
  handleIntegrityAlert(@MessageBody() data: { roomId: string; type: string; severity: string }, @ConnectedSocket() client: Socket) {
    this.server.to(data.roomId).emit('integrity-violation', data);
  }

  @SubscribeMessage('panel-vote')
  handlePanelVote(@MessageBody() data: { roomId: string; panelId: string; vote: string }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('vote-received', data);
  }

  @SubscribeMessage('chat-message')
  handleChatMessage(@MessageBody() data: { roomId: string; userId: string; message: string }, @ConnectedSocket() client: Socket) {
    this.server.to(data.roomId).emit('new-message', { ...data, timestamp: new Date() });
  }
}
