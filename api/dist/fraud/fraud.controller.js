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
exports.FraudController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const fraud_service_1 = require("./fraud.service");
let FraudController = class FraudController {
    fraudService;
    constructor(fraudService) {
        this.fraudService = fraudService;
    }
    analyzeFraud(userId) {
        return this.fraudService.analyzeFraud(userId);
    }
    getFraudReport(userId) {
        return this.fraudService.generateFraudReport(userId);
    }
};
exports.FraudController = FraudController;
__decorate([
    (0, common_1.Post)('analyze/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Run AI fraud analysis on a user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FraudController.prototype, "analyzeFraud", null);
__decorate([
    (0, common_1.Get)('report/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fraud report for a user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FraudController.prototype, "getFraudReport", null);
exports.FraudController = FraudController = __decorate([
    (0, swagger_1.ApiTags)('Fraud'),
    (0, common_1.Controller)('fraud'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [fraud_service_1.FraudService])
], FraudController);
//# sourceMappingURL=fraud.controller.js.map