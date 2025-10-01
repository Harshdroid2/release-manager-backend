import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

import { User } from '../../../db/release_manager/entity/users/user.entity';
import { Profile } from '../../../db/release_manager/entity/profiles/profiles.entity';
import { RegisterDto, LoginDto, AuthResponseDto, GitHubLoginDto } from '../dto/auth.dto';
import { UserRole } from '../../../constants/userRoles';

@Injectable()
export class AuthService {
  private readonly githubClientId = process.env.GITHUB_CLIENT_ID;
  private readonly githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, role = UserRole.DEV } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      isActive: true,
      isVerified: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Create profile
    const profile = this.profileRepository.create({
      userId: savedUser.id,
      email,
      firstName,
      lastName,
      isApproved: false,
    });

    await this.profileRepository.save(profile);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        firstName,
        lastName,
      },
    };
  }



  async githubLogin(githubLoginDto: GitHubLoginDto): Promise<AuthResponseDto> {
    const { code } = githubLoginDto;

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.githubClientId,
          client_secret: this.githubClientSecret,
          code,
        },
        { headers: { Accept: 'application/json' } }
      );

      const accessToken = tokenResponse.data.access_token;

      if (!accessToken) {
        throw new BadRequestException('Failed to get GitHub access token');
      }

      // Get user information from GitHub
      const octokit = new Octokit({ auth: accessToken });
      const userResponse = await octokit.rest.users.getAuthenticated();
      const githubUser = userResponse.data;

      // Check if user exists with this GitHub username
      let user = await this.userRepository.findOne({
        where: { githubUsername: githubUser.login },
        relations: ['profile']
      });

      if (!user) {
        // Check if user exists with this email
        user = await this.userRepository.findOne({
          where: { email: githubUser.email || `${githubUser.login}@github.local` },
          relations: ['profile']
        });

        if (user) {
          // Update existing user with GitHub info
          user.githubUsername = githubUser.login;
          user.githubAccessToken = accessToken;
          await this.userRepository.save(user);
        } else {
          // Create new user
          const newUser = this.userRepository.create({
            email: githubUser.email || `${githubUser.login}@github.local`,
            password: '', // No password for GitHub users
            githubUsername: githubUser.login,
            githubAccessToken: accessToken,
            role: UserRole.DEV,
            isActive: true,
            isVerified: true, // GitHub users are considered verified
          });

          user = await this.userRepository.save(newUser);

          // Create profile
          const profile = this.profileRepository.create({
            userId: user.id,
            email: user.email,
            firstName: githubUser.name?.split(' ')[0],
            lastName: githubUser.name?.split(' ').slice(1).join(' '),
            avatarUrl: githubUser.avatar_url,
            isApproved: true, // Auto-approve GitHub users
          });

          await this.profileRepository.save(profile);
        }
      } else {
        // Update access token
        user.githubAccessToken = accessToken;
        user.lastLogin = new Date();
        await this.userRepository.save(user);
      }

      // Generate JWT token
      const payload = { sub: user.id, email: user.email, role: user.role };
      const jwt_token = this.jwtService.sign(payload);

      return {
        access_token: jwt_token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          githubUsername: user.githubUsername,
        },
      };
    } catch (error) {
      throw new BadRequestException('GitHub authentication failed');
    }
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['profile']
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
