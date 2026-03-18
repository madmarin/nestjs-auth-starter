import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';

export const Auth = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('JWT-auth'),
    ApiUnauthorizedResponse({
      description: 'Token inválido o sesión expirada',
    }),
  );
