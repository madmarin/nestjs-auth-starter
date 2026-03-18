import { Injectable, Logger } from '@nestjs/common';
import { AuthRegisterDto, AuthRegisterResponseDto } from 'src/auth/dto';
import { UserCreateService } from 'src/user/services/core';

@Injectable()
export class AuthRegisterService {
  private readonly logger = new Logger(AuthRegisterService.name);

  constructor(private readonly userCreateService: UserCreateService) {}

  async execute(dto: AuthRegisterDto): Promise<AuthRegisterResponseDto> {
    this.logger.log(`Iniciando registro para: ${dto.email}`);

    const user = await this.userCreateService.execute({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });

    this.logger.log(`Usuario registrado con ID: ${user.id}`);

    return {
      email: user.email,
      message: 'Usuario registrado exitosamente',
    };
  }
}
