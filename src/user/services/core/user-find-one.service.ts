import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class UserFindOneService {
  private readonly logger = new Logger(UserFindOneService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(id: number): Promise<UserEntity> {
    this.logger.debug(`Finding user by ID: ${id}`);

    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    return user;
  }
}
