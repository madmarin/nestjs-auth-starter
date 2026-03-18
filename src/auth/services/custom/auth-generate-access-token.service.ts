import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGenerateAccessTokenService {
  private readonly logger = new Logger(AuthGenerateAccessTokenService.name);

  constructor(private readonly jwtService: JwtService) {}

  execute(userId: number, sessionId: string): string {
    this.logger.debug(
      `Generando access token para usuario ${userId}, sesión ${sessionId}`,
    );

    const payload = { sub: userId, sid: sessionId };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Access token generado para usuario ${userId}`);
    return accessToken;
  }
}
