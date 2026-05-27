"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudModule = void 0;
const common_1 = require("@nestjs/common");
const fraud_service_1 = require("./fraud.service");
const fraud_controller_1 = require("./fraud.controller");
const trust_score_module_1 = require("../trust-score/trust-score.module");
let FraudModule = class FraudModule {
};
exports.FraudModule = FraudModule;
exports.FraudModule = FraudModule = __decorate([
    (0, common_1.Module)({
        imports: [trust_score_module_1.TrustScoreModule],
        controllers: [fraud_controller_1.FraudController],
        providers: [fraud_service_1.FraudService],
        exports: [fraud_service_1.FraudService],
    })
], FraudModule);
//# sourceMappingURL=fraud.module.js.map