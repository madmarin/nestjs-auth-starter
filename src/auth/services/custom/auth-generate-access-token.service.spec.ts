import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthGenerateAccessTokenService } from './auth-generate-access-token.service';

describe('AuthGenerateAccessTokenService', () => {
  let service: AuthGenerateAccessTokenService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGenerateAccessTokenService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthGenerateAccessTokenService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call jwtService.sign with correct payload', () => {
    jwtService.sign.mockReturnValue('signed-token');

    const result = service.execute(1, 'session-uuid');

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      sid: 'session-uuid',
    });
    expect(result).toBe('signed-token');
  });

  it('should return the token produced by jwtService', () => {
    jwtService.sign.mockReturnValue('another-token');

    const result = service.execute(42, 'other-session');

    expect(result).toBe('another-token');
  });
});
