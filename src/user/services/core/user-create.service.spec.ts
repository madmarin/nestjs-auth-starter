import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UserCreateService, CreateUserDto } from './user-create.service';
import { UserEntity } from 'src/user/entities';

jest.mock('src/config/envs.config', () => ({
  envs: {
    bcrypt: { saltRounds: 10 },
  },
}));

const mockDto = (): CreateUserDto => ({
  email: 'new@example.com',
  password: 'Password123!',
  firstName: 'Juan',
  lastName: 'Perez',
  phone: '1234567890',
});

const mockSavedUser = (): UserEntity =>
  ({
    id: 1,
    email: 'new@example.com',
    password: 'hashed-password',
    firstName: 'Juan',
    lastName: 'Perez',
    phone: '1234567890',
    isActive: true,
  }) as unknown as UserEntity;

describe('UserCreateService', () => {
  let service: UserCreateService;
  let userRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCreateService,
        { provide: getRepositoryToken(UserEntity), useValue: userRepository },
      ],
    }).compile();

    service = module.get(UserCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException when email is already registered', async () => {
    userRepository.findOne.mockResolvedValue(mockSavedUser());

    await expect(service.execute(mockDto())).rejects.toThrow(ConflictException);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should hash the password before saving', async () => {
    userRepository.findOne.mockResolvedValue(null);
    userRepository.create.mockReturnValue({
      ...mockSavedUser(),
      password: 'hashed',
    });
    userRepository.save.mockResolvedValue(mockSavedUser());
    const hashSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue('hashed' as never);

    await service.execute(mockDto());

    expect(hashSpy).toHaveBeenCalledWith('Password123!', 10);
  });

  it('should create and save the user with hashed password', async () => {
    const dto = mockDto();
    const saved = mockSavedUser();
    userRepository.findOne.mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
    userRepository.create.mockReturnValue(saved);
    userRepository.save.mockResolvedValue(saved);

    const result = await service.execute(dto);

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: dto.email,
        password: 'hashed-password',
      }),
    );
    expect(result).toEqual(saved);
  });
});
