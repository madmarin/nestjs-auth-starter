import { Test, TestingModule } from '@nestjs/testing';
import { AuthLoginService } from './auth-login.service';
import { AuthValidateCredentialsService } from '../validation';
import { AuthCreateSessionService } from '../custom';
import { AuthGenerateAccessTokenService } from '../custom';
import { UserEntity } from 'src/user/entities';

const mockUser = (): UserEntity =>
  ({
    id: 1,
    email: 'test@example.com',
    firstName: 'Juan',
    lastName: 'Perez',
    phone: null,
    isActive: true,
  }) as unknown as UserEntity;

describe('AuthLoginService', () => {
  let service: AuthLoginService;
  let validateCredentials: jest.Mocked<AuthValidateCredentialsService>;
  let createSession: jest.Mocked<AuthCreateSessionService>;
  let generateAccessToken: jest.Mocked<AuthGenerateAccessTokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthLoginService,
        {
          provide: AuthValidateCredentialsService,
          useValue: { execute: jest.fn() },
        },
        { provide: AuthCreateSessionService, useValue: { execute: jest.fn() } },
        {
          provide: AuthGenerateAccessTokenService,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthLoginService);
    validateCredentials = module.get(AuthValidateCredentialsService);
    createSession = module.get(AuthCreateSessionService);
    generateAccessToken = module.get(AuthGenerateAccessTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should orchestrate login and return auth response', async () => {
    const user = mockUser();
    validateCredentials.execute.mockResolvedValue(user);
    createSession.execute.mockResolvedValue({
      sessionId: 'session-uuid',
      refreshToken: 'refresh-uuid',
    });
    generateAccessToken.execute.mockReturnValue('access-token');

    const result = await service.execute({
      email: user.email,
      password: 'pass123',
    });

    expect(validateCredentials.execute).toHaveBeenCalledWith(
      user.email,
      'pass123',
    );
    expect(createSession.execute).toHaveBeenCalledWith(user);
    expect(generateAccessToken.execute).toHaveBeenCalledWith(
      user.id,
      'session-uuid',
    );
    expect(result).toEqual({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      accessToken: 'access-token',
      refreshToken: 'refresh-uuid',
      sessionId: 'session-uuid',
    });
  });

  it('should propagate errors from validateCredentials', async () => {
    validateCredentials.execute.mockRejectedValue(new Error('invalid'));

    await expect(
      service.execute({ email: 'bad@example.com', password: 'wrong' }),
    ).rejects.toThrow('invalid');
  });
});
