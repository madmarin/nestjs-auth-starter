import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { SessionMetadata } from 'src/auth/interfaces';
import { envs } from 'src/config';

export interface CreateSessionResult {
  sessionId: string;
  refreshToken: string;
}

@Injectable()
export class AuthCreateSessionService {
  private readonly logger = new Logger(AuthCreateSessionService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async execute(user: UserEntity): Promise<CreateSessionResult> {
    this.logger.log(`Creando sesión para usuario ${user.id}`);

    const sessionId = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();

    const metadata: SessionMetadata = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sessionId,
      refreshToken,
      createdAt: new Date().toISOString(),
    };

    const ttl = envs.session.ttlMobileMs;

    await this.cacheManager.set(`auth:refresh:${sessionId}`, metadata, ttl);

    this.logger.log(`Sesión creada en Redis con TTL: ${ttl / 1000}s`);

    return { sessionId, refreshToken };
  }
}
