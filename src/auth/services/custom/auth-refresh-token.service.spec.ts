import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthGenerateAccessTokenService } from './auth-generate-access-token.service';
import { SessionMetadata } from 'src/auth/interfaces';

jest.mock('src/config', () => ({
  envs: {
    session: { ttlMobileMs: 2592000000 },
  },
}));

const mockSession = (): SessionMetadata => ({
  userId: 1,
  email: 'test@example.com',
  firstName: 'Juan',
  lastName: 'Perez',
  sessionId: 'old-session-id',
  refreshToken: 'old-refresh-token',
  createdAt: new Date().toISOString(),
});

describe('AuthRefreshTokenService', () => {
  let service: AuthRefreshTokenService;
  let cacheManager: { get: jest.Mock; set: jest.Mock; del: jest.Mock };
  let generateAccessTokenService: jest.Mocked<AuthGenerateAccessTokenService>;

  beforeEach(async () => {
    cacheManager = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRefreshTokenService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
        {
          provide: AuthGenerateAccessTokenService,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthRefreshTokenService);
    generateAccessTokenService = module.get(AuthGenerateAccessTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException when session is not found', async () => {
    cacheManager.get.mockResolvedValue(null);

    await expect(
      service.execute('session-id', 'refresh-token'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when refresh token does not match', async () => {
    cacheManager.get.mockResolvedValue(mockSession());

    await expect(
      service.execute('old-session-id', 'wrong-refresh-token'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return new tokens and rotate session on valid refresh', async () => {
    const session = mockSession();
    cacheManager.get.mockResolvedValue(session);
    cacheManager.del.mockResolvedValue(undefined);
    cacheManager.set.mockResolvedValue(undefined);
    generateAccessTokenService.execute.mockReturnValue('new-access-token');

    const result = await service.execute(
      session.sessionId,
      session.refreshToken,
    );

    expect(result.accessToken).toBe('new-access-token');
    expect(result.sessionId).not.toBe(session.sessionId);
    expect(result.refreshToken).not.toBe(session.refreshToken);
    expect(cacheManager.del).toHaveBeenCalledWith(
      `auth:refresh:${session.sessionId}`,
    );
    expect(cacheManager.set).toHaveBeenCalledWith(
      `auth:refresh:${result.sessionId}`,
      expect.objectContaining({ refreshToken: result.refreshToken }),
      2592000000,
    );
  });
});
