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
exports.TrustScoreController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const trust_score_service_1 = require("./trust-score.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let TrustScoreController = class TrustScoreController {
    trustScoreService;
    constructor(trustScoreService) {
        this.trustScoreService = trustScoreService;
    }
    getMyTrustScore(userId) {
        return this.trustScoreService.getTrustScore(userId);
    }
    getTrustScore(userId) {
        return this.trustScoreService.getTrustScore(userId);
    }
    recalculate(userId) {
        return this.trustScoreService.calculateTrustScore(userId);
    }
    getHistory(userId) {
        return this.trustScoreService.getTrustHistory(userId);
    }
    getWeakAreas(userId) {
        return this.trustScoreService.getWeakAreas(userId);
    }
};
exports.TrustScoreController = TrustScoreController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my trust score' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrustScoreController.prototype, "getMyTrustScore", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trust score of a specific user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrustScoreController.prototype, "getTrustScore", null);
__decorate([
    (0, common_1.Post)(':userId/recalculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Recalculate trust score for a user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrustScoreController.prototype, "recalculate", null);
__decorate([
    (0, common_1.Get)(':userId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trust score history' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrustScoreController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(':userId/weak-areas'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weak areas and improvement suggestions' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrustScoreController.prototype, "getWeakAreas", null);
exports.TrustScoreController = TrustScoreController = __decorate([
    (0, swagger_1.ApiTags)('Trust Score'),
    (0, common_1.Controller)('trust-score'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [trust_score_service_1.TrustScoreService])
], TrustScoreController);
//# sourceMappingURL=trust-score.controller.js.map