export class JwtPayloadDto {
  sub: number;
  sid: string;
  iat?: number;
  exp?: number;
}
