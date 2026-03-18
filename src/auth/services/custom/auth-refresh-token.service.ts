import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { SessionMetadata } from 'src/auth/interfaces';
import { AuthGenerateAccessTokenService } from './auth-generate-access-token.service';
import { envs } from 'src/config';
import { AuthRefreshTokenResponseDto } from 'src/auth/dto';

@Injectable()
export class AuthRefreshTokenService {
  private readonly logger = new Logger(AuthRefreshTokenService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly authGenerateAccessTokenService: AuthGenerateAccessTokenService,
  ) {}

  async execute(
    sessionId: string,
    refreshToken: string,
  ): Promise<AuthRefreshTokenResponseDto> {
    this.logger.log(`Refrescando token para sesión: ${sessionId}`);

    const redisKey = `auth:refresh:${sessionId}`;
    const session = await this.cacheManager.get<SessionMetadata>(redisKey);

    if (!session)
      throw new UnauthorizedException('Sesión no encontrada o expirada');

    if (session.refreshToken !== refreshToken)
      throw new UnauthorizedException('Refresh token inválido');

    const newRefreshToken = crypto.randomUUID();
    const newSessionId = crypto.randomUUID();

    const updatedMetadata: SessionMetadata = {
      ...session,
      sessionId: newSessionId,
      refreshToken: newRefreshToken,
    };

    const ttl = envs.session.ttlMobileMs;

    await this.cacheManager.del(redisKey);
    await this.cacheManager.set(
      `auth:refresh:${newSessionId}`,
      updatedMetadata,
      ttl,
    );

    const accessToken = this.authGenerateAccessTokenService.execute(
      session.userId,
      newSessionId,
    );

    this.logger.log(`Token refrescado para usuario ${session.userId}`);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      sessionId: newSessionId,
    };
  }
}
