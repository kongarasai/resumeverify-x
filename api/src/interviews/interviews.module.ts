import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { InterviewGateway } from './interview.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, InterviewGateway],
  exports: [InterviewsService],
})
export class InterviewsModule {}
