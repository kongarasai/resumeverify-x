import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  conversations(@Request() req: any) {
    return this.messagesService.getConversationList(req.user.id);
  }

  @Get('direct/:userId')
  direct(@Param('userId') userId: string, @Request() req: any) {
    return this.messagesService.getDirectMessages(req.user.id, userId);
  }

  @Get('group/:groupId')
  group(@Param('groupId') groupId: string) {
    return this.messagesService.getGroupMessages(groupId);
  }

  @Post('send')
  send(@Request() req: any, @Body() body: { receiverId?: string; groupId?: string; content: string; type?: string; fileUrl?: string }) {
    return this.messagesService.sendMessage(req.user.id, body.receiverId || null, body.groupId || null, body.content, body.type, body.fileUrl);
  }
}
