import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: keyof DecodedIdToken | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) return null;

    return data ? (user[data] as unknown) : user;
  },
);
