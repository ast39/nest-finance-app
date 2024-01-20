import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUrl = createParamDecorator(
  (module: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const url = `${request.protocol}://${request.get('Host')}/api`;

    return module ? `${url}/${module}` : url;
  },
);
