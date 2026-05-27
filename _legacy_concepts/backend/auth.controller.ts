// ResumeVerify X™ — Auth Controller (NestJS)
import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

export class RegisterDto {
  email: string;
  password: string;
  role: 'candidate' | 'teacher' | 'mentor' | 'recruiter' | 'placement_officer' | 'university_admin' | 'company_admin';
  firstName: string;
  lastName: string;
  universityId?: string;
  departmentId?: string;
}

export class LoginDto {
  email: string;
  password: string;
  twoFaCode?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.authService.logout(req.user.sessionId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@Request() req) {
    return this.authService.enable2FA(req.user.id);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  async verify2FA(@Request() req, @Body() body: { code: string }) {
    return this.authService.verify2FA(req.user.id, body.code);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Request() req) {
    return this.authService.getActiveSessions(req.user.id);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@Request() req) {
    return this.authService.logoutAllDevices(req.user.id);
  }
}
