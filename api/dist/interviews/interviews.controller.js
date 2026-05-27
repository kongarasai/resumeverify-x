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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const interviews_service_1 = require("./interviews.service");
const client_1 = require("@prisma/client");
let InterviewsController = class InterviewsController {
    interviewsService;
    constructor(interviewsService) {
        this.interviewsService = interviewsService;
    }
    createRoom(userId, dto) {
        return this.interviewsService.createRoom(userId, dto);
    }
    getRooms(isLive, type, page, limit) {
        return this.interviewsService.getRooms({ isLive, type, page, limit });
    }
    getRoomById(id) {
        return this.interviewsService.getRoomById(id);
    }
    joinRoom(userId, roomCode) {
        return this.interviewsService.joinRoom(userId, roomCode);
    }
    endRoom(userId, id) {
        return this.interviewsService.endRoom(userId, id);
    }
    saveScorecard(id, dto) {
        return this.interviewsService.saveScorecard(id, dto);
    }
    getRecordings(id) {
        return this.interviewsService.getRecordings(id);
    }
};
exports.InterviewsController = InterviewsController;
__decorate([
    (0, common_1.Post)('rooms'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create interview room' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interviews_service_1.CreateInterviewRoomDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)('rooms'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all interview rooms' }),
    (0, swagger_1.ApiQuery)({ name: 'isLive', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: client_1.InterviewType }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('isLive')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String, Number, Number]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "getRooms", null);
__decorate([
    (0, common_1.Get)('rooms/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "getRoomById", null);
__decorate([
    (0, common_1.Post)('rooms/:roomCode/join'),
    (0, swagger_1.ApiOperation)({ summary: 'Join interview room by room code' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('roomCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)('rooms/:id/end'),
    (0, swagger_1.ApiOperation)({ summary: 'End an interview room' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "endRoom", null);
__decorate([
    (0, common_1.Post)('rooms/:id/scorecard'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Save interview scorecard' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, interviews_service_1.ScorecardDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "saveScorecard", null);
__decorate([
    (0, common_1.Get)('rooms/:id/recordings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get interview recordings' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "getRecordings", null);
exports.InterviewsController = InterviewsController = __decorate([
    (0, swagger_1.ApiTags)('Interviews'),
    (0, common_1.Controller)('interviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService])
], InterviewsController);
//# sourceMappingURL=interviews.controller.js.map