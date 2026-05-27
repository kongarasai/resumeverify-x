// ResumeVerify X™ — NestJS App Module (Root)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { PrismaService } from './prisma.service';
import { TrustScoreService } from './trust-score.service';
import { AiReportService } from './ai-report.service';
import { FraudDetectionService } from './fraud-detection.service';
import { CodingJudgeService } from './coding-judge.service';
import { PlacementCellService } from './placement-cell.service';
import { InterviewGateway } from './interview.gateway';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService, TrustScoreService, AiReportService,
    FraudDetectionService, CodingJudgeService, PlacementCellService,
    InterviewGateway, NotificationsGateway,
  ],
})
export class AppModule {}
