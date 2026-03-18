import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class UserFindByEmailService {
  private readonly logger = new Logger(UserFindByEmailService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    email: string,
    includePassword = false,
  ): Promise<UserEntity | null> {
    this.logger.debug(`Finding user by email: ${email}`);

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (includePassword) query.addSelect('user.password');

    return query.getOne();
  }
}
