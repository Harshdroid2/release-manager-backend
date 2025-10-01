import { Controller, Post, Body, Get, UseGuards, ValidationPipe } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { User } from '../../../db/release_manager/entity/users/user.entity';
import { UserRole } from '../../../constants/userRoles';
import { SignupService } from '../services/signup.service';

@Controller('/v1/signup')
export class AuthController {
  constructor(private readonly signupService: SignupService) {}

  @Post('/')
  async signup(@Body(ValidationPipe) registerDto: SignupDto): Promise<void> {
    return this.signupService.signUp(registerDto);
  }
}
