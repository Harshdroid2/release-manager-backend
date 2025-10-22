import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Algorithm } from "jsonwebtoken";
import { MyUser } from "./db/release_manager/entity/users/my-user.entity";
import { plainToInstance } from "class-transformer";
import * as jwt from "jsonwebtoken";
import { privateKey } from "src/utils";


@Injectable()
export class AuthGuard implements CanActivate {
    private issuer = "FieldAssist";
    private algorithm: Algorithm = "RS256";

  public verifyAccessTokenJwt(token: string): any {
    return jwt.verify(token, privateKey, {
      issuer: this.issuer,
      algorithms: [this.algorithm],
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(`Request headers for ${request.path}`, JSON.stringify(request.headers));

    try {
        const bearer = request.headers.authorization.split(" ");
        const accessToken = bearer[1];
      const decodedAccessToken = await this.verifyAccessTokenJwt(accessToken);
      const userObject = { ...decodedAccessToken, accessToken };
      // Set user
      request.user = plainToInstance(MyUser, userObject);

      return true;
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e;
      }

      throw new UnauthorizedException();
    }
  }
}
