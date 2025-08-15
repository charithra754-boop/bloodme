import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { Donor, DonorDocument } from '../schemas/donor.schema';
import { Hospital, HospitalDocument } from '../schemas/hospital.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Donor.name) private donorModel: Model<DonorDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log('Registration attempt:', { 
      email: registerDto.email, 
      role: registerDto.role,
      hasLocation: !!registerDto.location 
    });
    
    const { email, password, role, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new this.userModel({
      ...userData,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await user.save();

    // Create role-specific profile
    if (role === UserRole.DONOR) {
      const donor = new this.donorModel({
        userId: savedUser._id,
        bloodGroup: registerDto.bloodGroup,
        dateOfBirth: registerDto.dateOfBirth,
        weight: registerDto.weight,
      });
      await donor.save();
    } else if (role === UserRole.HOSPITAL) {
      const hospital = new this.hospitalModel({
        userId: savedUser._id,
        hospitalName: registerDto.hospitalName,
        licenseNumber: registerDto.licenseNumber,
        contactPerson: registerDto.contactPerson,
        emergencyContact: registerDto.emergencyContact,
      });
      await hospital.save();
    }

    // Generate JWT token
    const payload = { 
      sub: savedUser._id, 
      email: savedUser.email, 
      role: savedUser.role 
    };
    
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        phone: savedUser.phone,
        address: savedUser.address,
        location: savedUser.location,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email, isActive: true });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };
    
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        location: user.location,
      },
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email, isActive: true });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
}