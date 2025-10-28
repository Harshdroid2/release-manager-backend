import { Injectable } from "@nestjs/common";
import { Octokit } from "@octokit/rest";
import { Release, ReleaseDto } from "src/db/release_manager/entity/release/release.entity";
import { ReleaseRepository } from "src/db/release_manager/entity/release/release.repository";
import { ProjectService } from "src/modules/projects/services/project.service";

@Injectable()
export class ReleaseService {

    constructor(
        private releaseRepository: ReleaseRepository,
        private projectService: ProjectService
      ) {}

    public async createRelease(release: ReleaseDto): Promise<void> {
      await this.releaseRepository.create(release)
    }

    public async getPendingReleases(repo: string): Promise<void> {
        await this.releaseRepository.getRepository().find({
            where: {
                repo,
                isApproved: false
            }
        })
      }

    public async getCompletedReleases(repo: string, gitToken: string): Promise<Release[]> {
        const completedReleases: Release[] = [];
        const releases = await this.releaseRepository.getRepository().find({
            where:{
                repo
            }
        })
        for(const release of releases){
            const actions = await this.projectService.getActions(repo, gitToken, release.version);
            const isCompleted = actions.workflow_runs.every(action => action.status === 'completed');
            if(isCompleted){
                await this.releaseRepository.getRepository().update(release.id, {isCompleted: true, isRunning: false})
                completedReleases.push(release)
            }
        }
        return completedReleases
      }


      public async getRunningReleases(repo: string, gitToken: string): Promise<Release[]> {
        const inprogressReleases: Release[] = [];
        const releases = await this.releaseRepository.getRepository().find({
            where:{
                repo,
                isCompleted: false
            }
        })
        for(const release of releases){
            const actions = await this.projectService.getActions(repo, gitToken, release.version);
            const isCompleted = actions.workflow_runs.every(action => action.status === 'in_progress');
            if(isCompleted){
                await this.releaseRepository.getRepository().update(release.id, {isRunning: true, isCompleted: false})
                inprogressReleases.push(release)
            }
        }
        return inprogressReleases
      }
}