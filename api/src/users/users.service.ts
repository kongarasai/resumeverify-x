import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  githubUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  leetcodeUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  codechefUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hackerrankUsername?: string;

  @ApiPropertyOptional({ enum: Department })
  @IsOptional()
  department?: Department;
}

export class UpdateAvatarDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        phone: true,
        avatarUrl: true,
        githubUsername: true,
        leetcodeUsername: true,
        linkedinUrl: true,
        codechefUsername: true,
        hackerrankUsername: true,
        skills: true,
        experience: true,
        certifications: true,
        department: true,
        isVerified: true,
        twoFactorEnabled: true,
        subscriptionPlan: true,
        onboardingDone: true,
        createdAt: true,
        university: {
          select: { id: true, name: true, code: true, logoUrl: true },
        },
        trustScore: {
          select: {
            totalScore: true,
            trustLevel: true,
            weakAreas: true,
            lastCalculated: true,
          },
        },
        rankings: {
          select: {
            universityRank: true,
            departmentRank: true,
            codingRank: true,
            xp: true,
            badges: true,
            streakDays: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.githubUsername !== undefined && { githubUsername: dto.githubUsername }),
        ...(dto.leetcodeUsername !== undefined && { leetcodeUsername: dto.leetcodeUsername }),
        ...(dto.linkedinUrl !== undefined && { linkedinUrl: dto.linkedinUrl }),
        ...(dto.codechefUsername !== undefined && { codechefUsername: dto.codechefUsername }),
        ...(dto.hackerrankUsername !== undefined && { hackerrankUsername: dto.hackerrankUsername }),
        ...(dto.department && { department: dto.department }),
        onboardingDone: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        phone: true,
        githubUsername: true,
        leetcodeUsername: true,
        linkedinUrl: true,
        department: true,
        updatedAt: true,
      },
    });

    return { user: updated, message: 'Profile updated successfully' };
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: { id: true, avatarUrl: true },
    });
    return { user: updated, message: 'Avatar updated successfully' };
  }

  async getConnectedAccounts(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        githubUsername: true,
        leetcodeUsername: true,
        linkedinUrl: true,
        codechefUsername: true,
        hackerrankUsername: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      github: {
        connected: !!user.githubUsername,
        username: user.githubUsername,
      },
      leetcode: {
        connected: !!user.leetcodeUsername,
        username: user.leetcodeUsername,
      },
      linkedin: {
        connected: !!user.linkedinUrl,
        url: user.linkedinUrl,
      },
      codechef: {
        connected: !!user.codechefUsername,
        username: user.codechefUsername,
      },
      hackerrank: {
        connected: !!user.hackerrankUsername,
        username: user.hackerrankUsername,
      },
    };
  }

  async connectGithub(userId: string, username: string) {
    const githubToken = this.config.get('GITHUB_TOKEN');
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: { Authorization: `token ${githubToken}` },
      });

      if (response.status !== 200) {
        throw new BadRequestException('GitHub username not found');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { githubUsername: username },
      });

      return {
        message: 'GitHub account connected successfully',
        profile: {
          login: response.data.login,
          publicRepos: response.data.public_repos,
          followers: response.data.followers,
          following: response.data.following,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to connect GitHub account');
    }
  }

  async syncGithub(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { githubUsername: true, githubToken: true },
    });

    if (!user?.githubUsername) {
      throw new BadRequestException('GitHub account not connected');
    }

    const githubToken = user.githubToken || this.config.get('GITHUB_TOKEN');

    try {
      const [profileRes, reposRes] = await Promise.all([
        axios.get(`https://api.github.com/users/${user.githubUsername}`, {
          headers: { Authorization: `token ${githubToken}` },
        }),
        axios.get(`https://api.github.com/users/${user.githubUsername}/repos?per_page=100&sort=pushed`, {
          headers: { Authorization: `token ${githubToken}` },
        }),
      ]);

      const profile = profileRes.data;
      const repos = reposRes.data;

      const totalStars = repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0);
      const languages = [...new Set(repos.map((r: any) => r.language).filter(Boolean))];

      return {
        message: 'GitHub synced successfully',
        data: {
          publicRepos: profile.public_repos,
          followers: profile.followers,
          following: profile.following,
          totalStars,
          languages,
          topRepos: repos.slice(0, 5).map((r: any) => ({
            name: r.name,
            description: r.description,
            stars: r.stargazers_count,
            language: r.language,
            url: r.html_url,
          })),
        },
      };
    } catch {
      throw new BadRequestException('Failed to sync GitHub data');
    }
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        department: true,
        githubUsername: true,
        linkedinUrl: true,
        createdAt: true,
        university: {
          select: { name: true, logoUrl: true },
        },
        trustScore: {
          select: { totalScore: true, trustLevel: true },
        },
        rankings: {
          select: { universityRank: true, codingRank: true, xp: true, badges: true },
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            techStack: true,
            githubUrl: true,
            liveUrl: true,
          },
          take: 6,
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
