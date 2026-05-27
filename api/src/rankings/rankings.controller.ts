import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Rankings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get('university/:universityId')
  university(@Param('universityId') universityId: string) {
    return this.rankingsService.getUniversityLeaderboard(universityId);
  }

  @Get('coding')
  coding(@Query('universityId') universityId?: string) {
    return this.rankingsService.getCodingLeaderboard(universityId);
  }

  @Get('department/:universityId/:department')
  department(@Param('universityId') universityId: string, @Param('department') department: string) {
    return this.rankingsService.getDepartmentLeaderboard(universityId, department);
  }

  @Get('user/:userId')
  user(@Param('userId') userId: string) {
    return this.rankingsService.getUserRanking(userId);
  }
}
