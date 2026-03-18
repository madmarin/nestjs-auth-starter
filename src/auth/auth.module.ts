import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AUTH_CONTROLLERS } from './controllers';
import { AUTH_CORE_SERVICES } from './services/core';
import { AUTH_CUSTOM_SERVICES } from './services/custom';
import { AUTH_VALIDATION_SERVICES } from './services/validation';
import { JwtAuthGuard } from './guards';
import { UserModule } from 'src/user/user.module';
import { envs } from 'src/config';
import { StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => ({
        secret: envs.jwt.secret,
        signOptions: {
          expiresIn: envs.jwt.expiresIn as StringValue,
        },
      }),
    }),
    UserModule,
  ],
  controllers: [...AUTH_CONTROLLERS],
  providers: [
    ...AUTH_CORE_SERVICES,
    ...AUTH_CUSTOM_SERVICES,
    ...AUTH_VALIDATION_SERVICES,
    JwtAuthGuard,
  ],
  exports: [
    ...AUTH_CUSTOM_SERVICES,
    ...AUTH_CORE_SERVICES,
    ...AUTH_VALIDATION_SERVICES,
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}
