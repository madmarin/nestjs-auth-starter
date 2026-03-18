/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const path: string = request.url;

    return next.handle().pipe(
      map((data) => {
        if (data === undefined || data === null) {
          return {
            success: true,
            message: 'Operación exitosa',
            data: null,
            timestamp: new Date().toISOString(),
            path,
          };
        }

        let message = 'Operación exitosa';
        let responseData = data;

        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message as string;
          const { message: _, ...rest } = data;
          responseData = Object.keys(rest).length === 0 ? null : rest;
        }

        return {
          success: true,
          message,
          data: responseData,
          timestamp: new Date().toISOString(),
          path,
        };
      }),
    );
  }
}
