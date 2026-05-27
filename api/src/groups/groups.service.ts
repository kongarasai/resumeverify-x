import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(data: { name: string; description?: string; createdById: string; universityId?: string }) {
    const group = await this.prisma.group.create({ data });
    await this.prisma.groupMember.create({ data: { groupId: group.id, userId: data.createdById, role: 'ADMIN' } });
    return group;
  }

  async getGroupById(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { createdBy: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { members: true } } },
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async getUserGroups(userId: string) {
    return this.prisma.groupMember.findMany({
      where: { userId },
      include: { group: { include: { _count: { select: { members: true, assignments: true } } } } },
    });
  }

  async joinGroup(groupId: string, userId: string) {
    return this.prisma.groupMember.upsert({
      where: { groupId_userId: { groupId, userId } },
      update: {},
      create: { groupId, userId, role: 'MEMBER' },
    });
  }

  async getGroupMembers(groupId: string) {
    return this.prisma.groupMember.findMany({
      where: { groupId },
      include: { user: { select: { id: true, name: true, avatarUrl: true, role: true }, include: { trustScore: { select: { totalScore: true } } } } },
    });
  }

  async addAnnouncement(groupId: string, authorId: string, title: string, content: string, isPinned = false) {
    return this.prisma.announcement.create({ data: { groupId, authorId, title, content, isPinned } });
  }

  async getAnnouncements(groupId: string) {
    return this.prisma.announcement.findMany({
      where: { groupId },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  }
}
