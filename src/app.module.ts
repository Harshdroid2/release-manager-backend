import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitAuthController } from './modules/auth/controllers/github-auth.controller';
import { ProjectController } from './modules/projects/controllers/project.controller';
import { ProjectService } from './modules/projects/services/project.service';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './db/release_manager/entity/users/user.entity';
import { Profile } from './db/release_manager/entity/profiles/profiles.entity';
import { Admin } from './db/release_manager/entity/admin/admin.entity';
import { MainDbService } from './db/release_manager/mainDbService';
import { UserRepository } from './modules/users/repositories/user.repository';
import { AdminRepository } from './modules/signup/repositories/admin.repositories';

@Global()
@Module({
  imports: [
  ],
  controllers: [AppController, ProjectController, GitAuthController],
  providers: [AppService, ProjectService, MainDbService, UserRepository, AdminRepository],
  exports: [MainDbService, UserRepository, AdminRepository],
})
export class AppModule {}
