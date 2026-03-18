import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRefreshTokenService } from '../services/custom/auth-refresh-token.service';
import { AuthRefreshTokenDto, AuthRefreshTokenResponseDto } from '../dto';
import { Public } from '../decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthTokenController {
  constructor(
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refrescar access token',
    description: 'Genera un nuevo access token usando el refresh token.',
  })
  async refresh(
    @Body() dto: AuthRefreshTokenDto,
  ): Promise<AuthRefreshTokenResponseDto> {
    return this.authRefreshTokenService.execute(
      dto.sessionId,
      dto.refreshToken,
    );
  }
}
