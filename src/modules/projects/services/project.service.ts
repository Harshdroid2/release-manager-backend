import { Injectable } from "@nestjs/common";
import { Octokit } from "@octokit/rest";

@Injectable()
export class ProjectService {
    private octokit: Octokit;

    constructor() {
      this.octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
      });
    }

    public async getAllProjects(): Promise<any> {
      const response = await this.octokit.rest.repos.listForAuthenticatedUser();
      
      return response.data;
    }

    public async getReleaseBranches(repo: string): Promise<any> {
      const response = await this.octokit.rest.repos.listBranches({
        owner: 'FieldAssist',
        repo
      });
    }
}