import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { MyUser } from "./db/release_manager/entity/users/my-user.entity";

export const User = createParamDecorator((data, ctx: ExecutionContext): MyUser | null => {
  const user: MyUser | undefined | null = ctx.switchToHttp().getRequest().user;

  if (!user) {
    return null;
  }

  return user;
});
