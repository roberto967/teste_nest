import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

// Mock do usuário que seria retornado pelo banco
const userEntityMock = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashedpassword',
} as User;

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  // Definindo os mocks antes do beforeEach para evitar problemas de escopo
  const mockUserRepository = {
    create: jest.fn(() => userEntityMock),
    save: jest.fn(() => Promise.resolve(userEntityMock)),
    find: jest.fn(() => Promise.resolve([userEntityMock])),
    findOneBy: jest.fn(() => Promise.resolve(userEntityMock)),
    update: jest.fn(() => Promise.resolve({ affected: 1 })),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  };

  const mockRefreshTokenRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager as unknown as Cache,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const expectedRepoPayload = {
        name: createDto.name,
        email: createDto.email,
        password: createDto.password,
      };

      const result = await usersService.create(
        createDto.email,
        createDto.password,
        createDto.name,
      );

      expect(result).toEqual(userEntityMock);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expectedRepoPayload,
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(userEntityMock);
    });
  });
});
