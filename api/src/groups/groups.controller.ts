import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Request() req: any, @Body() body: { name: string; description?: string; universityId?: string }) {
    return this.groupsService.createGroup({ ...body, createdById: req.user.id });
  }

  @Get('my')
  myGroups(@Request() req: any) {
    return this.groupsService.getUserGroups(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.getGroupById(id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Request() req: any) {
    return this.groupsService.joinGroup(id, req.user.id);
  }

  @Get(':id/members')
  members(@Param('id') id: string) {
    return this.groupsService.getGroupMembers(id);
  }

  @Get(':id/announcements')
  announcements(@Param('id') id: string) {
    return this.groupsService.getAnnouncements(id);
  }

  @Post(':id/announcements')
  addAnnouncement(
    @Param('id') id: string, @Request() req: any,
    @Body() body: { title: string; content: string; isPinned?: boolean },
  ) {
    return this.groupsService.addAnnouncement(id, req.user.id, body.title, body.content, body.isPinned);
  }
}
