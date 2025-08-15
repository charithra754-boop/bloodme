import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../schemas/user.schema';
import { Donor } from '../schemas/donor.schema';
import { Hospital } from '../schemas/hospital.schema';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockDonorModel: any;
  let mockHospitalModel: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockDonorModel = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockHospitalModel = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Donor.name),
          useValue: mockDonorModel,
        },
        {
          provide: getModelToken(Hospital.name),
          useValue: mockHospitalModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new donor', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        role: 'donor' as any,
        address: '123 Test St',
        location: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128] as [number, number]
        },
        bloodGroup: 'O+' as any,
        dateOfBirth: '1990-01-01',
        weight: 70
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.prototype.save = jest.fn().mockResolvedValue({
        _id: 'user123',
        ...registerDto,
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });
  });
});