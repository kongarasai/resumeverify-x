"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GroupsService = class GroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createGroup(data) {
        const group = await this.prisma.group.create({ data });
        await this.prisma.groupMember.create({ data: { groupId: group.id, userId: data.createdById, role: 'ADMIN' } });
        return group;
    }
    async getGroupById(id) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            include: { createdBy: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { members: true } } },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        return group;
    }
    async getUserGroups(userId) {
        return this.prisma.groupMember.findMany({
            where: { userId },
            include: { group: { include: { _count: { select: { members: true, assignments: true } } } } },
        });
    }
    async joinGroup(groupId, userId) {
        return this.prisma.groupMember.upsert({
            where: { groupId_userId: { groupId, userId } },
            update: {},
            create: { groupId, userId, role: 'MEMBER' },
        });
    }
    async getGroupMembers(groupId) {
        return this.prisma.groupMember.findMany({
            where: { groupId },
            include: { user: { select: { id: true, name: true, avatarUrl: true, role: true }, include: { trustScore: { select: { totalScore: true } } } } },
        });
    }
    async addAnnouncement(groupId, authorId, title, content, isPinned = false) {
        return this.prisma.announcement.create({ data: { groupId, authorId, title, content, isPinned } });
    }
    async getAnnouncements(groupId) {
        return this.prisma.announcement.findMany({
            where: { groupId },
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        });
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map