import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { TrustScoreModule } from '../trust-score/trust-score.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TrustScoreModule,
    MulterModule.register({ dest: './uploads/resumes' }),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
