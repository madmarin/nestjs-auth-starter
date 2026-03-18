import { AuthLoginService } from './auth-login.service';
import { AuthRegisterService } from './auth-register.service';
import { AuthLogoutService } from './auth-logout.service';

export { AuthLoginService, AuthRegisterService, AuthLogoutService };

export const AUTH_CORE_SERVICES = [
  AuthLoginService,
  AuthRegisterService,
  AuthLogoutService,
];
