import { Body, Controller, Get, Injectable, Query, UseGuards } from "@nestjs/common";
import { ReleaseService } from "../services/release.service";
import { MyUser } from "../../../db/release_manager/entity/users/my-user.entity";
import { UserRole } from "../../../constants/userRoles";
import { AuthGuard } from "src/auth.guard";
import { User } from "src/user.decorator";
import { ReleaseDto } from "src/db/release_manager/entity/release/release.entity";

@Controller("/v1/releases")
@UseGuards(AuthGuard)
@Injectable()
export class ReleaseController {
    constructor(
      private releaseService: ReleaseService
    ) {}


    @Get("/create")
    public async createRelease(
        @Body() body: ReleaseDto,
      @User() user: MyUser
    ): Promise<any> {
     await this.releaseService.createRelease(body);
     return 'release created'
    }

    @Get("/pending")
    public async getPendingReleases(
      @Query("repo") repo: string,
      @User() user: MyUser
    ): Promise<any> {
     await this.releaseService.getPendingReleases(repo);
     return 'release created'
    }

    @Get("/completed")
    public async getCompletedReleases(
      @Query("repo") repo: string,
      @User() user: MyUser
    ): Promise<any> {
      return await this.releaseService.getCompletedReleases(repo, user.githubAccessToken);
    }

    @Get("/running")
    public async getRunningReleases(
      @Query("repo") repo: string,
      @User() user: MyUser
    ): Promise<any> {
      return await this.releaseService.getRunningReleases(repo, user.githubAccessToken);
    }

}