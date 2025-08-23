import { IsEmail, IsString, IsEnum, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, IsPhoneNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UserRole, BloodGroup } from '../../schemas/user.schema';

class LocationDto {
  @IsString()
  type: string;

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  // Frontend sends confirmPassword but we don't need to validate it in backend
  @IsOptional()
  @IsString()
  confirmPassword?: string;

  @IsString()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  address: string;

  // Handle both location object and separate lat/lng
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  // Frontend sends separate latitude/longitude
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  // Donor-specific fields
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  // Hospital-specific fields
  @IsOptional()
  @IsString()
  hospitalName?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsArray()
  medicalConditions?: string[];

  @IsOptional()
  @IsArray()
  medications?: string[];
}