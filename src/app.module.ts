import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubAuthController } from './modules/auth/controllers/github-auth.controller';
import { ProjectController } from './modules/projects/controllers/project.controller';
import { ProjectService } from './modules/projects/services/project.service';
import { MainDbService } from './db/release_manager/MainDbService';
import { GithubAuthService } from './modules/auth/services/github-auth.service';
import { TokenService } from './modules/auth/services/token.service';
import { MyUserRepository } from './db/release_manager/entity/users/my-user.repository';
import { ReleaseRepository } from './db/release_manager/entity/release/release.repository';
import { ReleaseController } from './modules/releases/controllers/release.constroller';
import { ReleaseService } from './modules/releases/services/release.service';
import { AdminRepository } from './db/release_manager/entity/admin/admin.repository';
import { SignupService } from './modules/signup/services/signup.service';

@Module({
  imports: [
  ],
  controllers: [AppController, ProjectController, GithubAuthController, ReleaseController],
  providers: [AppService, ProjectService, GithubAuthService,  MainDbService,TokenService, ReleaseRepository, ReleaseService, MyUserRepository, AdminRepository, SignupService]
})
export class AppModule implements OnApplicationShutdown{
  constructor(    
    private mainDbService: MainDbService,
  ){
    console.log(mainDbService)
  }

  async onApplicationShutdown(signal?: string): Promise<any> {
    console.log(`Received OnApplicationShutdown: ${signal}`);
    console.log('⌛ Closing Db connections...');
    await this.mainDbService.close();
  }
}
