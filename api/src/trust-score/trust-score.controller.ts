import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { TrustScoreService } from './trust-score.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Trust Score')
@Controller('trust-score')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TrustScoreController {
  constructor(private readonly trustScoreService: TrustScoreService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my trust score' })
  getMyTrustScore(@CurrentUser('id') userId: string) {
    return this.trustScoreService.getTrustScore(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get trust score of a specific user' })
  getTrustScore(@Param('userId') userId: string) {
    return this.trustScoreService.getTrustScore(userId);
  }

  @Post(':userId/recalculate')
  @ApiOperation({ summary: 'Recalculate trust score for a user' })
  recalculate(@Param('userId') userId: string) {
    return this.trustScoreService.calculateTrustScore(userId);
  }

  @Get(':userId/history')
  @ApiOperation({ summary: 'Get trust score history' })
  getHistory(@Param('userId') userId: string) {
    return this.trustScoreService.getTrustHistory(userId);
  }

  @Get(':userId/weak-areas')
  @ApiOperation({ summary: 'Get weak areas and improvement suggestions' })
  getWeakAreas(@Param('userId') userId: string) {
    return this.trustScoreService.getWeakAreas(userId);
  }
}
