import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/user/entities/user.entity';
import { envs } from 'src/config/envs.config';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

@Injectable()
export class UserCreateService {
  private readonly logger = new Logger(UserCreateService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    this.logger.log(`Creating user with email: ${dto.email}`);

    const existing = await this.userRepository.findOne({
      where: { email: dto.email, isActive: true },
    });

    if (existing)
      throw new ConflictException(
        `El email ${dto.email} ya se encuentra registrado`,
      );

    const hashedPassword = await bcrypt.hash(
      dto.password,
      envs.bcrypt.saltRounds,
    );

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });

    const saved = await this.userRepository.save(user);
    this.logger.log(`User created with ID: ${saved.id}`);
    return saved;
  }
}
