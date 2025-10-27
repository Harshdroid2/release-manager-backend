import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

import { MyUser } from '../../../db/release_manager/entity/users/my-user.entity';
import { MyUserRepository } from '../../../db/release_manager/entity/users/my-user.repository';
import { AdminRepository } from '../../../db/release_manager/entity/admin/admin.repository';
import { RegisterDto, LoginDto, AuthResponseDto, GitHubLoginDto } from '../dto/auth.dto';
import { UserRole } from '../../../constants/userRoles';
import { ValidationError } from 'class-validator';
import { Admin } from 'src/db/release_manager/entity';
import { TokenService } from './token.service';
import { AdminDto } from 'src/db/release_manager/entity/admin/admin.entity';
import { Response } from 'express';
import { getGithubLoginRdirectUrl } from 'src/utils';

@Injectable()
export class GithubAuthService {

  constructor(
    private userRepository: MyUserRepository,
    private adminRepository: AdminRepository,
    private tokenService: TokenService
  ) {}


  public async signup(code: string, res: Response): Promise<void> {
    // Get user information from GitHub

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: getGithubLoginRdirectUrl()
      },
      {
        headers: { Accept: "application/json" }
      }
    );

    const octokit = new Octokit({ auth: tokenResponse.data.access_token });
    const { data: gitUser } = await octokit.rest.users.getAuthenticated();

    const { data: gitEmails } = await octokit.rest.users.listEmailsForAuthenticatedUser();

    const primaryEmail = gitEmails.find(email => email.primary)?.email;

    if(!primaryEmail){
        throw new Error('Primary email not found');
    }

    // Check if user already exists
    const [existingUser, existingAmin] = await Promise.all([
        this.userRepository.getByEmail(primaryEmail),
        this.adminRepository.getByEmail(primaryEmail)
    ]);

    if (existingUser || existingAmin) {
      throw new ConflictException('User with this email already exists');
    }

    const adminDto: AdminDto = {
      email: primaryEmail,
      name: gitUser.name,
      username: gitUser.login,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      role: UserRole.ADMIN
    }
    const admin = await this.adminRepository.create(adminDto);
    const accessToken = this.tokenService.generateAccessToken(admin, tokenResponse.data.access_token);
    this.tokenService.setAccessTokenCookie(accessToken, res);
  }

  public async login(code: string, res: Response): Promise<void> {
    // Get user information from GitHub
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: getGithubLoginRdirectUrl()
      },
      {
        headers: { Accept: "application/json" }
      }
    );

    const octokit = new Octokit({ auth: tokenResponse.data.access_token });
    const { data: gitUser } = await octokit.rest.users.getAuthenticated();

    const { data: gitEmails } = await octokit.rest.users.listEmailsForAuthenticatedUser();

    const primaryEmail = gitEmails.find(email => email.primary)?.email;

    if(!primaryEmail){
        throw new Error('Primary email not found');
    }

    // Check if user exists
    const [existingUser, existingAdmin] = await Promise.all([
        this.userRepository.getByEmail(primaryEmail),
        this.adminRepository.getByEmail(primaryEmail)
    ]);

    const user = existingUser || existingAdmin;

    if (!user) {
      throw new UnauthorizedException('User not found. Please sign up first.');
    }

    // Generate access token and set cookie
    const accessToken = this.tokenService.generateAccessToken(user, tokenResponse.data.access_token);
    this.tokenService.setAccessTokenCookie(accessToken, res);
  }
}
