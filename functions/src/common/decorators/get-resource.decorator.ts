import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetResource = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resource = request.resource;
    return data ? resource?.[data] : resource;
  },
);
