import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

import { MyUser } from '../../../db/release_manager/entity/users/my-user.entity';
import { SignupDto } from '../dto/signup.dto';
import { UserRole } from '../../../constants/userRoles';

@Injectable()
export class SignupService {

  constructor(
  ) {}

  async signUp(registerDto: SignupDto): Promise<void> {
    const { email, name , githubAccessToken, githubUsername } = registerDto;

    // const existingUser = await this.adminRepository.getByEmail(email);
    // if (existingUser) {
    //   throw new ConflictException('User with this email already exists');
    // }

    // // Create user
    // const user = this.adminRepository.create({
    //   email,
    //   githubAccessToken, 
    //   githubUsername,
    //   name,
    //   role: UserRole.ADMIN,
    //   isActive: true,
    //   isVerified: false,
    // });
    
  }
}
