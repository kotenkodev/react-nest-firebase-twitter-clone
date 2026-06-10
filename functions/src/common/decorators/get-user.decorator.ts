import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const GetUser = createParamDecorator(
  (
    data: keyof admin.auth.DecodedIdToken | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as admin.auth.DecodedIdToken;

    return data ? user?.[data] : user;
  },
);
