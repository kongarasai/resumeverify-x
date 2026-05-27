import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService, UpdateProfileDto, UpdateAvatarDto } from './users.service';
import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ConnectGithubDto {
  @ApiProperty({ example: 'octocat' })
  @IsString()
  username: string;
}

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/avatar')
  @ApiOperation({ summary: 'Update user avatar' })
  updateAvatar(@CurrentUser('id') userId: string, @Body() dto: UpdateAvatarDto) {
    return this.usersService.updateAvatar(userId, dto.avatarUrl!);
  }

  @Get('me/connected-accounts')
  @ApiOperation({ summary: 'Get connected external accounts' })
  getConnectedAccounts(@CurrentUser('id') userId: string) {
    return this.usersService.getConnectedAccounts(userId);
  }

  @Patch('me/connect/github')
  @ApiOperation({ summary: 'Connect GitHub account' })
  connectGithub(@CurrentUser('id') userId: string, @Body() dto: ConnectGithubDto) {
    return this.usersService.connectGithub(userId, dto.username);
  }

  @Get('me/sync/github')
  @ApiOperation({ summary: 'Sync GitHub data' })
  syncGithub(@CurrentUser('id') userId: string) {
    return this.usersService.syncGithub(userId);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get public profile of a user' })
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
