/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errorDetails: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        if (Array.isArray(responseObj.message)) {
          message = 'Validación fallida';
          errorDetails = responseObj.message;
        } else {
          message = responseObj.error || this.getMessageFromStatus(status);
          errorDetails = responseObj.message;
        }
      }
    } else if (this.isPostgresError(exception)) {
      const parsed = this.parsePostgresError(exception as any);
      status = parsed.status;
      message = parsed.message;
      errorDetails = parsed.detail;
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = exception.stack;
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}: ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    const errorResponse: ApiResponseDto = Array.isArray(errorDetails)
      ? {
          success: false,
          message: 'Datos inválidos',
          errors: errorDetails,
          timestamp: new Date().toISOString(),
          path: request.url,
        }
      : {
          success: false,
          message,
          error: errorDetails,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

    response.status(status).json(errorResponse);
  }

  private getMessageFromStatus(status: number): string {
    const map: Record<number, string> = {
      400: 'Solicitud inválida',
      401: 'No autorizado',
      403: 'Prohibido',
      404: 'No encontrado',
      409: 'Conflicto',
      500: 'Error interno del servidor',
    };
    return map[status] || 'Error desconocido';
  }

  private isPostgresError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as any).code === 'string' &&
      (exception as any).code.startsWith('23')
    );
  }

  private parsePostgresError(error: any): {
    status: number;
    message: string;
    detail: string;
  } {
    const detail = error.detail || '';

    if (error.code === '23505') {
      const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
      const value = match ? match[2] : 'valor';
      return {
        status: HttpStatus.CONFLICT,
        message: 'Conflicto',
        detail: `El valor '${value}' ya existe. Ingresa un valor diferente.`,
      };
    }

    if (error.code === '23503') {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Solicitud inválida',
        detail: 'La referencia especificada no existe en la base de datos.',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error de base de datos',
      detail: 'Ocurrió un error inesperado.',
    };
  }
}
