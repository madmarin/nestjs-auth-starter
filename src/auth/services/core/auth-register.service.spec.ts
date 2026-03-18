import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AuthRegisterService } from './auth-register.service';
import { UserCreateService } from 'src/user/services/core';
import { UserEntity } from 'src/user/entities';
import { AuthRegisterDto } from 'src/auth/dto';

const mockRegisterDto = (): AuthRegisterDto => ({
  email: 'new@example.com',
  password: 'Password123!',
  firstName: 'Juan',
  lastName: 'Perez',
  phone: '1234567890',
});

const mockCreatedUser = (): UserEntity =>
  ({
    id: 1,
    email: 'new@example.com',
    firstName: 'Juan',
    lastName: 'Perez',
    phone: '1234567890',
    isActive: true,
  }) as unknown as UserEntity;

describe('AuthRegisterService', () => {
  let service: AuthRegisterService;
  let userCreateService: jest.Mocked<UserCreateService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRegisterService,
        { provide: UserCreateService, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    service = module.get(AuthRegisterService);
    userCreateService = module.get(UserCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user and return email and success message', async () => {
    userCreateService.execute.mockResolvedValue(mockCreatedUser());
    const dto = mockRegisterDto();

    const result = await service.execute(dto);

    expect(userCreateService.execute).toHaveBeenCalledWith({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });
    expect(result).toEqual({
      email: dto.email,
      message: 'Usuario registrado exitosamente',
    });
  });

  it('should propagate ConflictException when email is already registered', async () => {
    userCreateService.execute.mockRejectedValue(
      new ConflictException('El email ya se encuentra registrado'),
    );

    await expect(service.execute(mockRegisterDto())).rejects.toThrow(
      ConflictException,
    );
  });
});
