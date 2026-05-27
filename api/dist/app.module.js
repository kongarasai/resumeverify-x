"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const trust_score_module_1 = require("./trust-score/trust-score.module");
const resume_module_1 = require("./resume/resume.module");
const fraud_module_1 = require("./fraud/fraud.module");
const assignments_module_1 = require("./assignments/assignments.module");
const interviews_module_1 = require("./interviews/interviews.module");
const jobs_module_1 = require("./jobs/jobs.module");
const messages_module_1 = require("./messages/messages.module");
const notifications_module_1 = require("./notifications/notifications.module");
const rankings_module_1 = require("./rankings/rankings.module");
const ai_module_1 = require("./ai/ai.module");
const groups_module_1 = require("./groups/groups.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            trust_score_module_1.TrustScoreModule,
            resume_module_1.ResumeModule,
            fraud_module_1.FraudModule,
            assignments_module_1.AssignmentsModule,
            interviews_module_1.InterviewsModule,
            jobs_module_1.JobsModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
            rankings_module_1.RankingsModule,
            ai_module_1.AiModule,
            groups_module_1.GroupsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map