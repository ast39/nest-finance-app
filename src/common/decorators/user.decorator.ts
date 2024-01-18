import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const JwtUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1].trim();

    const jwtService = new JwtService();
    const payload = jwtService.decode(token);

    return data ? payload?.[data] : token;
  },
);
