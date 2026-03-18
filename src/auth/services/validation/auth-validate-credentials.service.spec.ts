import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthValidateCredentialsService } from './auth-validate-credentials.service';
import { UserFindByEmailService } from 'src/user/services/custom';
import { UserEntity } from 'src/user/entities';

const mockUser = (): UserEntity =>
  ({
    id: 1,
    email: 'test@example.com',
    password: 'hashed-password',
    firstName: 'Juan',
    lastName: 'Perez',
    phone: null,
    isActive: true,
  }) as unknown as UserEntity;

describe('AuthValidateCredentialsService', () => {
  let service: AuthValidateCredentialsService;
  let userFindByEmailService: jest.Mocked<UserFindByEmailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthValidateCredentialsService,
        {
          provide: UserFindByEmailService,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthValidateCredentialsService);
    userFindByEmailService = module.get(UserFindByEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    userFindByEmailService.execute.mockResolvedValue(null);

    await expect(
      service.execute('notfound@example.com', 'pass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user is inactive', async () => {
    const user = { ...mockUser(), isActive: false } as unknown as UserEntity;
    userFindByEmailService.execute.mockResolvedValue(user);

    await expect(service.execute(user.email, 'pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    userFindByEmailService.execute.mockResolvedValue(mockUser());
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      service.execute('test@example.com', 'wrong-pass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return the user when credentials are valid', async () => {
    const user = mockUser();
    userFindByEmailService.execute.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.execute(user.email, 'correct-pass');

    expect(result).toEqual(user);
    expect(userFindByEmailService.execute).toHaveBeenCalledWith(
      user.email,
      true,
    );
  });
});
