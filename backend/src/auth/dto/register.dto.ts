import { IsEmail, IsString, IsEnum, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
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

  @IsString()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  address: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

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
}