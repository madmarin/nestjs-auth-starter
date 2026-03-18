import { AuthGenerateAccessTokenService } from './auth-generate-access-token.service';
import { AuthCreateSessionService } from './auth-create-session.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';

export {
  AuthGenerateAccessTokenService,
  AuthCreateSessionService,
  AuthRefreshTokenService,
};

export const AUTH_CUSTOM_SERVICES = [
  AuthGenerateAccessTokenService,
  AuthCreateSessionService,
  AuthRefreshTokenService,
];
