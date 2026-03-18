import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AuthRefreshTokenDto {
  @ApiProperty({ description: 'Refresh token UUID obtenido al hacer login' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  refreshToken: string;

  @ApiProperty({ description: 'Session ID obtenido al hacer login' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;
}

export class AuthRefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}
