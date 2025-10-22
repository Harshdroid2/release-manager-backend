import { Algorithm } from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import { Response } from "express";
import { Admin } from "../../../db/release_manager/entity/admin/admin.entity";
import { MyUser } from "../../../db/release_manager/entity/users/my-user.entity";
import { Injectable } from "@nestjs/common";
import * as process from "process";
import { getRequiredEnvValue, privateKey } from "src/utils";

@Injectable()
export class TokenService {
  private ACCESS_TOKEN_KEY = "accessToken";
  private REFRESH_TOKEN_KEY = "refreshToken";

  private issuer = "FieldAssist";
  private algorithm: Algorithm = "RS256";

  public generateAccessToken(userObj: MyUser | Admin, githubAccessToken: string): string {
    return jwt.sign(Object.assign({}, {...userObj, githubAccessToken}),privateKey, {
      expiresIn: `${process.env.EXPIRY_SECONDS_ACCESS}s`,
      issuer: this.issuer,
      algorithm: this.algorithm,
      allowInsecureKeySizes: true,
    });
  }

  public generateRefreshToken(uid: number, loginGuid: string): string {
    return jwt.sign(
      { uid: uid, loginGuid: loginGuid },
      process.env.SECRET_REFRESH!,
      {
        expiresIn: `${process.env.EXPIRY_SECONDS_REFRESH}s`,
        issuer: this.issuer,
      },
    );
  }

  public setAccessTokenCookie(token: string, res: Response): void {
    res.cookie(this.ACCESS_TOKEN_KEY, token, {
      httpOnly: true,
      maxAge: Number(process.env.EXPIRY_SECONDS_ACCESS!) * 1000,
    });
  }

  public setRefreshTokenCookie(token: string, res: Response): void {
    res.cookie(this.REFRESH_TOKEN_KEY, token, {
      httpOnly: true,
      maxAge: Number(process.env.EXPIRY_SECONDS_REFRESH!) * 1000,
    });
  }

  public decodeRefreshToken(token: string | undefined): any {
    if (!token) {
      throw new Error("Token cannot be null/empty!");
    }
    return jwt.verify(token, process.env.SECRET_REFRESH!);
  }

  public verifyAccessTokenJwt(token: string): any {
    return jwt.verify(token, getRequiredEnvValue("JWT_PUBLIC_KEY"), {
      issuer: this.issuer,
      algorithms: [this.algorithm],
    });
  }

  public removeTokenCookies(res: Response): void {
    res.cookie(this.ACCESS_TOKEN_KEY, { maxAge: 0 });
    res.cookie(this.REFRESH_TOKEN_KEY, { maxAge: 0 });
  }
}
