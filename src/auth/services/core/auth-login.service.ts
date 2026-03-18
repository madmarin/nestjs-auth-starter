import { Injectable, Logger } from '@nestjs/common';
import { AuthLoginDto, AuthLoginResponseDto } from 'src/auth/dto';
import { AuthValidateCredentialsService } from '../validation';
import {
  AuthCreateSessionService,
  AuthGenerateAccessTokenService,
} from '../custom';

@Injectable()
export class AuthLoginService {
  private readonly logger = new Logger(AuthLoginService.name);

  constructor(
    private readonly authValidateCredentialsService: AuthValidateCredentialsService,
    private readonly authCreateSessionService: AuthCreateSessionService,
    private readonly authGenerateAccessTokenService: AuthGenerateAccessTokenService,
  ) {}

  async execute(dto: AuthLoginDto): Promise<AuthLoginResponseDto> {
    const { email, password } = dto;
    this.logger.log(`Intento de login: ${email}`);

    const user = await this.authValidateCredentialsService.execute(
      email,
      password,
    );

    const { sessionId, refreshToken } =
      await this.authCreateSessionService.execute(user);

    const accessToken = this.authGenerateAccessTokenService.execute(
      user.id,
      sessionId,
    );

    this.logger.log(`Usuario ${user.email} autenticado exitosamente`);

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      accessToken,
      refreshToken,
      sessionId,
    };
  }
}
