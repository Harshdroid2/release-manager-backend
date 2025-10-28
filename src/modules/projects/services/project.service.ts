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

    public async getReleaseBranches(repo: string, gitToken: string): Promise<any> {
      const octokit = new Octokit({ auth: gitToken });
      const response = await octokit.rest.repos.listBranches({
        owner: 'FieldAssist',
        repo
      });
      return response.data;

    }

    public async getAllTags(repo: string, gitToken: string) {
      const owner = "FieldAssist";

      const octokit = new Octokit({ auth: gitToken });
    
      const response = await octokit.rest.repos.listTags({
        owner,
        repo,
        per_page: 100, // optional, max 100 per page
      });
    
      const tags = response.data.map(tag => ({
        name: tag.name,
        commitSha: tag.commit.sha,
      }));
    
      console.log(tags);
    }

    public async getActions(repo: string, gitToken: string, branch?: string) {
      const owner = "FieldAssist";
      const octokit = new Octokit({ auth: gitToken });
    
      // Option 1: Get runs for all workflows
      const params: any = {
        owner,
        repo,
        per_page: 100, // limit results
      }
      if(branch){
        params.branch = branch
      }
      const allRuns = await octokit.actions.listWorkflowRunsForRepo(params);
    
      return allRuns.data
    }
    
}