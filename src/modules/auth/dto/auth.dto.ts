import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../../constants/userRoles';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    githubUsername?: string;
  };
}

export class GitHubLoginDto {
  @IsString()
  code: string;
}
