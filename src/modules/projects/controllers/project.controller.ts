import { Controller, Get, Injectable, Query, UseGuards } from "@nestjs/common";
import { ProjectService } from "../services/project.service";
import { MyUser } from "../../../db/release_manager/entity/users/my-user.entity";
import { UserRole } from "../../../constants/userRoles";
import { AuthGuard } from "src/auth.guard";
import { User } from "src/user.decorator";

@Controller("/v1/projects")
@UseGuards(AuthGuard)
@Injectable()
export class ProjectController {
    constructor(
      private projectService: ProjectService
    ) {}

    @Get("/")
    public async getAllProjects(
      @User() user: MyUser
    ): Promise<any> {
      return await this.projectService.getAllProjects(user.githubAccessToken);
    }

    @Get("/branches")
    public async getReleaseBranches(
      @Query("repo") repo: string,
      @User() user: MyUser
    ): Promise<any> {
      return await this.projectService.getReleaseBranches(repo, user.githubAccessToken);
    }
}