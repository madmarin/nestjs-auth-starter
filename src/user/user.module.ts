import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { USER_CORE_SERVICES } from './services/core';
import { USER_CUSTOM_SERVICES } from './services/custom';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [...USER_CORE_SERVICES, ...USER_CUSTOM_SERVICES],
  exports: [...USER_CORE_SERVICES, ...USER_CUSTOM_SERVICES],
})
export class UserModule {}
