import { Controller, Get, Injectable, Query, UseGuards } from "@nestjs/common";
import { ProjectService } from "../services/project.service";
import { User } from "../../../db/release_manager/entity/users/user.entity";
import { UserRole } from "../../../constants/userRoles";

@Controller("/v1/projects")
@Injectable()
export class ProjectController {
    constructor(
      private projectService: ProjectService
    ) {}

    // @Get("/")
    // @Roles(UserRole.ADMIN, UserRole.DEV, UserRole.QA, UserRole.RELEASE_MANAGER)
    // public async getAllProjects(
    //   @CurrentUser() user: User
    // ): Promise<any> {
    //   return await this.projectService.getAllProjects();
    // }

    // @Get("/branches")
    // @Roles(UserRole.ADMIN, UserRole.DEV, UserRole.QA, UserRole.RELEASE_MANAGER)
    // public async getReleaseBranches(
    //   @Query("repo") repo: string,
    //   @CurrentUser() user: User
    // ): Promise<any> {
    //   return await this.projectService.getReleaseBranches(repo);
    // }
}