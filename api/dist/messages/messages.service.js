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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMessage(senderId, receiverId, groupId, content, type = 'TEXT', fileUrl) {
        return this.prisma.message.create({
            data: { senderId, receiverId, groupId, content, type: type, fileUrl },
            include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
        });
    }
    async getDirectMessages(userId1, userId2) {
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
    async getGroupMessages(groupId) {
        return this.prisma.message.findMany({
            where: { groupId },
            include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async pinMessage(messageId) {
        return this.prisma.message.update({ where: { id: messageId }, data: { isPinned: true } });
    }
    async markAsRead(messageId) {
        return this.prisma.message.update({ where: { id: messageId }, data: { isRead: true } });
    }
    async getConversationList(userId) {
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map