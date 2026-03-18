import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthCreateSessionService } from './auth-create-session.service';
import { UserEntity } from 'src/user/entities';

jest.mock('src/config', () => ({
  envs: {
    session: { ttlMobileMs: 2592000000 },
  },
}));

const mockUser = (): UserEntity =>
  ({
    id: 1,
    email: 'test@example.com',
    firstName: 'Juan',
    lastName: 'Perez',
    phone: null,
    isActive: true,
  }) as unknown as UserEntity;

describe('AuthCreateSessionService', () => {
  let service: AuthCreateSessionService;
  let cacheManager: { get: jest.Mock; set: jest.Mock; del: jest.Mock };

  beforeEach(async () => {
    cacheManager = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCreateSessionService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get(AuthCreateSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store session metadata in cache and return sessionId and refreshToken', async () => {
    const user = mockUser();
    cacheManager.set.mockResolvedValue(undefined);

    const result = await service.execute(user);

    expect(result.sessionId).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(cacheManager.set).toHaveBeenCalledWith(
      `auth:refresh:${result.sessionId}`,
      expect.objectContaining({
        userId: user.id,
        email: user.email,
        sessionId: result.sessionId,
        refreshToken: result.refreshToken,
      }),
      2592000000,
    );
  });

  it('should generate unique sessionId and refreshToken each call', async () => {
    cacheManager.set.mockResolvedValue(undefined);
    const user = mockUser();

    const first = await service.execute(user);
    const second = await service.execute(user);

    expect(first.sessionId).not.toBe(second.sessionId);
    expect(first.refreshToken).not.toBe(second.refreshToken);
  });
});
