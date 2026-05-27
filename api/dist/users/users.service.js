"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = exports.UpdateAvatarDto = exports.UpdateProfileDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@nestjs/config");
class UpdateProfileDto {
    name;
    bio;
    phone;
    githubUsername;
    leetcodeUsername;
    linkedinUrl;
    codechefUsername;
    hackerrankUsername;
    department;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "githubUsername", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "leetcodeUsername", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "codechefUsername", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "hackerrankUsername", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Department }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "department", void 0);
class UpdateAvatarDto {
    avatarUrl;
}
exports.UpdateAvatarDto = UpdateAvatarDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAvatarDto.prototype, "avatarUrl", void 0);
let UsersService = class UsersService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
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
    async updateAvatar(userId, avatarUrl) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
            select: { id: true, avatarUrl: true },
        });
        return { user: updated, message: 'Avatar updated successfully' };
    }
    async getConnectedAccounts(userId) {
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
        if (!user)
            throw new common_1.NotFoundException('User not found');
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
    async connectGithub(userId, username) {
        const githubToken = this.config.get('GITHUB_TOKEN');
        try {
            const response = await axios_1.default.get(`https://api.github.com/users/${username}`, {
                headers: { Authorization: `token ${githubToken}` },
            });
            if (response.status !== 200) {
                throw new common_1.BadRequestException('GitHub username not found');
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
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.BadRequestException('Failed to connect GitHub account');
        }
    }
    async syncGithub(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { githubUsername: true, githubToken: true },
        });
        if (!user?.githubUsername) {
            throw new common_1.BadRequestException('GitHub account not connected');
        }
        const githubToken = user.githubToken || this.config.get('GITHUB_TOKEN');
        try {
            const [profileRes, reposRes] = await Promise.all([
                axios_1.default.get(`https://api.github.com/users/${user.githubUsername}`, {
                    headers: { Authorization: `token ${githubToken}` },
                }),
                axios_1.default.get(`https://api.github.com/users/${user.githubUsername}/repos?per_page=100&sort=pushed`, {
                    headers: { Authorization: `token ${githubToken}` },
                }),
            ]);
            const profile = profileRes.data;
            const repos = reposRes.data;
            const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
            const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];
            return {
                message: 'GitHub synced successfully',
                data: {
                    publicRepos: profile.public_repos,
                    followers: profile.followers,
                    following: profile.following,
                    totalStars,
                    languages,
                    topRepos: repos.slice(0, 5).map((r) => ({
                        name: r.name,
                        description: r.description,
                        stars: r.stargazers_count,
                        language: r.language,
                        url: r.html_url,
                    })),
                },
            };
        }
        catch {
            throw new common_1.BadRequestException('Failed to sync GitHub data');
        }
    }
    async getPublicProfile(userId) {
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
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map