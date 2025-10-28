import { Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  
  @Post("/signout")
  async signout(@Res() res: Response) {
    try {
      // Clear the access token cookie
      res.clearCookie('accessToken', {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        path: '/',
        domain: 'localhost',
      });

      // Return success response
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully signed out' 
      });
    } catch (error) {
      console.error('Signout error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to sign out' 
      });
    }
  }
}
