import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SessionUserDataDto } from '../dto';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUserDataDto => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: SessionUserDataDto }>();
    return request.user;
  },
);
