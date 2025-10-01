// github-auth.controller.ts
import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { Public } from "../decorators/public.decorator";

@Controller("auth/github")
export class GitAuthController {
  private clientId = process.env.GITHUB_CLIENT_ID;

  // Step 1: Redirect user to GitHub OAuth
  @Public()
  @Get("login")
  async githubLogin(@Res() res: Response) {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=http://localhost:4000/api/auth/github/callback&scope=repo user:email`;
    res.redirect(redirectUrl);
  }

  @Public()
  @Get("callback")
  async githubCallback(@Query("code") code: string, @Res() res: Response) {
    // Redirect to frontend with the code for processing
    res.redirect(
      `http://localhost:3000/auth/github/callback?code=${code}`
    );
  }
}