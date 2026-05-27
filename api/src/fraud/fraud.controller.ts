import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { FraudService } from './fraud.service';

@ApiTags('Fraud')
@Controller('fraud')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @Post('analyze/:userId')
  @ApiOperation({ summary: 'Run AI fraud analysis on a user' })
  analyzeFraud(@Param('userId') userId: string) {
    return this.fraudService.analyzeFraud(userId);
  }

  @Get('report/:userId')
  @ApiOperation({ summary: 'Get fraud report for a user' })
  getFraudReport(@Param('userId') userId: string) {
    return this.fraudService.generateFraudReport(userId);
  }
}
