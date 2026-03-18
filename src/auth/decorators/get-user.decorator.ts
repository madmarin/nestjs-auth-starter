import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionUserDataDto } from '../dto';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUserDataDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as SessionUserDataDto;
  },
);
