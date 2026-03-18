import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/user/entities';
import { UserFindByEmailService } from 'src/user/services/custom';

@Injectable()
export class AuthValidateCredentialsService {
  private readonly logger = new Logger(AuthValidateCredentialsService.name);

  constructor(
    private readonly userFindByEmailService: UserFindByEmailService,
  ) {}

  async execute(email: string, password: string): Promise<UserEntity> {
    this.logger.log(`Validando credenciales para: ${email}`);

    const user = await this.userFindByEmailService.execute(email, true);

    if (!user) {
      this.logger.warn(`Login fallido: usuario no encontrado para ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      this.logger.warn(`Login fallido: usuario ${email} inactivo`);
      throw new UnauthorizedException('La cuenta de usuario está inactiva');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login fallido: contraseña incorrecta para ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.logger.log(`Credenciales validadas para usuario ID: ${user.id}`);
    return user;
  }
}
