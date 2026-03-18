import { Module } from '@nestjs/common';
import { redisConfig, throttleConfig, typeOrmConfig } from './config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CacheModule.registerAsync(redisConfig),
    ThrottlerModule.forRoot(throttleConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    CommonModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
