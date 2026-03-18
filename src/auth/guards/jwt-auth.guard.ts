import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { IS_PUBLIC_KEY } from '../decorators';
import { SessionUserDataDto, JwtPayloadDto } from '../dto';
import { SessionMetadata } from '../interfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Token no proporcionado');

    let payload: JwtPayloadDto;
    try {
      payload = this.jwtService.verify<JwtPayloadDto>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const { sub: userId, sid: sessionId } = payload;

    if (!userId || !sessionId)
      throw new UnauthorizedException('Payload del token inválido');

    const sessionMetadata = await this.cacheManager.get<SessionMetadata>(
      `auth:refresh:${sessionId}`,
    );

    if (!sessionMetadata)
      throw new UnauthorizedException('Sesión no encontrada o expirada');

    const user: SessionUserDataDto = {
      userId: sessionMetadata.userId,
      email: sessionMetadata.email,
      firstName: sessionMetadata.firstName,
      lastName: sessionMetadata.lastName,
      sessionId: sessionMetadata.sessionId,
      isActive: true,
    };

    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
