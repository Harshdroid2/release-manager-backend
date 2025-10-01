import { Controller, Post, Body, Get, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, AuthResponseDto, GitHubLoginDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../../db/release_manager/entity/users/user.entity';
import { UserRole } from '../../../constants/userRoles';

@Controller('auth')
export class AuthController {
}