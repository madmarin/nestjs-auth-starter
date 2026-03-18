import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthLogoutService } from './auth-logout.service';

describe('AuthLogoutService', () => {
  let service: AuthLogoutService;
  let cacheManager: { del: jest.Mock };

  beforeEach(async () => {
    cacheManager = { del: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthLogoutService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get(AuthLogoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete the session key from cache', async () => {
    cacheManager.del.mockResolvedValue(undefined);

    await service.execute('session-uuid');

    expect(cacheManager.del).toHaveBeenCalledWith('auth:refresh:session-uuid');
  });

  it('should resolve without returning a value', async () => {
    cacheManager.del.mockResolvedValue(undefined);

    const result = await service.execute('session-uuid');

    expect(result).toBeUndefined();
  });
});
