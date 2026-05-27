import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrustScoreModule } from './trust-score/trust-score.module';
import { ResumeModule } from './resume/resume.module';
import { FraudModule } from './fraud/fraud.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { InterviewsModule } from './interviews/interviews.module';
import { JobsModule } from './jobs/jobs.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RankingsModule } from './rankings/rankings.module';
import { AiModule } from './ai/ai.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    TrustScoreModule,
    ResumeModule,
    FraudModule,
    AssignmentsModule,
    InterviewsModule,
    JobsModule,
    MessagesModule,
    NotificationsModule,
    RankingsModule,
    AiModule,
    GroupsModule,
  ],
})
export class AppModule {}
