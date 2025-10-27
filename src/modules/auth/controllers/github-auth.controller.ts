// github-auth.controller.ts
import { Controller, Get, Injectable, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { getGithubLoginRdirectUrl, getRequiredEnvValue } from "src/utils";
import { GithubAuthService } from "../services/github-auth.service";

@Controller("auth/github")
@Injectable()
export class GithubAuthController {

constructor(
  private readonly githubAuthService: GithubAuthService
){}
  @Get("/signup")
  async githubSignup(@Res() res: Response) {
    // Use state parameter to differentiate between signup and login
    const redirectUrl = `${getRequiredEnvValue("GITHUB_AUTHORIZE_URL")}?client_id=${getRequiredEnvValue("GITHUB_CLIENT_ID")}&redirect_uri=${getGithubLoginRdirectUrl()}&scope=repo,user:email,read:org&state=signup`;
    res.redirect(redirectUrl);
  }

  @Get("/login")
  async githubLogin(@Res() res: Response) {
    // Use state parameter to differentiate between signup and login
    const redirectUrl = `${getRequiredEnvValue("GITHUB_AUTHORIZE_URL")}?client_id=${getRequiredEnvValue("GITHUB_CLIENT_ID")}&redirect_uri=${getGithubLoginRdirectUrl()}&scope=repo,user:email,read:org&state=login`;
    res.redirect(redirectUrl);
  }

  @Get("/callback")
  async githubCallback(@Query("code") code: string, @Query("state") state: string, @Res() res: Response) {
    try {
      // Check the state parameter to determine if it's signup or login
      if (state === 'signup') {
        await this.githubAuthService.signup(code, res);
      } else if (state === 'login') {
        await this.githubAuthService.login(code, res);
      } else {
        throw new Error('Invalid state parameter');
      }
      
      // Redirect to frontend callback page which will handle the rest
      res.redirect(
        `http://localhost:8080/auth/github/callback?code=${code}`
      );
    } catch (error) {
      console.error('GitHub callback error:', error);
      // Redirect to auth page with error
      res.redirect(`http://localhost:8080/auth?error=${encodeURIComponent(error.message)}`);
    }
  }
}
