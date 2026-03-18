import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthLogoutService {
  private readonly logger = new Logger(AuthLogoutService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async execute(sessionId: string): Promise<void> {
    await this.cacheManager.del(`auth:refresh:${sessionId}`);
    this.logger.log(`Sesión ${sessionId} terminada`);
  }
}
