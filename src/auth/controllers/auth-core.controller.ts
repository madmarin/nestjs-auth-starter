import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthLoginService,
  AuthLogoutService,
  AuthRegisterService,
} from '../services/core';
import {
  AuthLoginDto,
  AuthLoginResponseDto,
  AuthRegisterDto,
  AuthRegisterResponseDto,
  SessionUserDataDto,
} from '../dto';
import { Auth, GetUser, Public } from '../decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthCoreController {
  constructor(
    private readonly authRegisterService: AuthRegisterService,
    private readonly authLoginService: AuthLoginService,
    private readonly authLogoutService: AuthLogoutService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(
    @Body() dto: AuthRegisterDto,
  ): Promise<AuthRegisterResponseDto> {
    return this.authRegisterService.execute(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica al usuario y devuelve access token y refresh token.',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: AuthLoginDto): Promise<AuthLoginResponseDto> {
    return this.authLoginService.execute(dto);
  }

  @Auth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout(@GetUser() user: SessionUserDataDto): Promise<void> {
    return this.authLogoutService.execute(user.sessionId);
  }
}
