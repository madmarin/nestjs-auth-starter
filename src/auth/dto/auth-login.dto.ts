import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MiPassword123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthLoginResponseDto {
  userId: number;
  email: string;
  firstName: string;
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}
