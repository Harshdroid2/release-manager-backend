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
    const redirectUrl = `${getRequiredEnvValue("GITHUB_AUTHORIZE_URL")}?client_id=${getRequiredEnvValue("GITHUB_CLIENT_ID")}&redirect_uri=${getGithubLoginRdirectUrl()}-signup&scope=repo,user:email,read:org`;
    res.redirect(redirectUrl);
  }

  @Post("/login")
  async githubLogin(@Res() res: Response) {
    const redirectUrl = `${getRequiredEnvValue("GITHUB_AUTHORIZE_URL")}?client_id=${getRequiredEnvValue("GITHUB_CLIENT_ID")}&redirect_uri=${getGithubLoginRdirectUrl()}-login&scope=repo,user:email,read:org`;
    res.redirect(redirectUrl);
  }

  @Get("/callback-signup")
  async githubSignUpCallback(@Query("code") code: string, @Res() res: Response) {
    await this.githubAuthService.signup(code, res);
    res.redirect(
      `http://localhost:3000/auth/github/callback?code=${code}`
    );
  }

  @Post("/callback-login")
  async githubLoginCallback(@Query("code") code: string, @Res() res: Response) {
    res.redirect(
      `http://localhost:3000/auth/github/callback?code=${code}`
    );
  }
}