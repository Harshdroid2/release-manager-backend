import { Injectable } from "@nestjs/common";
import { Octokit } from "@octokit/rest";

@Injectable()
export class ProjectService {
    private octokit: Octokit;

    constructor() {
    }

    public async getAllProjects(gitToken: string): Promise<any> {
      const octokit = new Octokit({ auth: gitToken });
      const response = await octokit.rest.repos.listForAuthenticatedUser();
      
      return response.data;
    }

    public async getReleaseBranches(repo: string): Promise<any> {
      const response = await this.octokit.rest.repos.listBranches({
        owner: 'FieldAssist',
        repo
      });
    }
}