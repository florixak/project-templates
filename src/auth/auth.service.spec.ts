import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { DATABASE_CONNECTION } from '../database/database.module';
import { AuthService } from './auth.service';
import { Role } from './enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  const signAsync = jest.fn().mockResolvedValue('token');

  const mockDb = {
    select: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
        {
          provide: JwtService,
          useValue: { signAsync },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
    signAsync.mockResolvedValue('token');
  });

  it('returns access token for valid credentials', async () => {
    const passwordHash = await argon2.hash('password123');
    const limit = jest.fn().mockResolvedValue([
      {
        id: 1,
        email: 'admin@example.com',
        passwordHash,
        role: Role.ADMIN,
      },
    ]);
    const where = jest.fn().mockReturnValue({ limit });
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({ where }),
    });

    const result = await service.login({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(result.accessToken).toBe('token');
    expect(signAsync).toHaveBeenCalled();
  });

  it('throws for invalid credentials', async () => {
    const limit = jest.fn().mockResolvedValue([]);
    const where = jest.fn().mockReturnValue({ limit });
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({ where }),
    });

    await expect(
      service.login({ email: 'missing@example.com', password: 'password123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
