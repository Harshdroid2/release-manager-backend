import { Controller, Get, Injectable, Query, UseGuards } from "@nestjs/common";
import { ProjectService } from "../services/project.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { User } from "../../../db/release_manager/entity/users/user.entity";
import { UserRole } from "../../../constants/userRoles";

@Controller("/v1/projects")
@Injectable()
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(
      private projectService: ProjectService
    ) {}

    @Get("/")
    @Roles(UserRole.ADMIN, UserRole.DEV, UserRole.QA, UserRole.RELEASE_MANAGER)
    public async getAllProjects(
      @CurrentUser() user: User
    ): Promise<any> {
      return await this.projectService.getAllProjects();
    }

    @Get("/branches")
    @Roles(UserRole.ADMIN, UserRole.DEV, UserRole.QA, UserRole.RELEASE_MANAGER)
    public async getReleaseBranches(
      @Query("repo") repo: string,
      @CurrentUser() user: User
    ): Promise<any> {
      return await this.projectService.getReleaseBranches(repo);
    }
}