import { IsEnum, IsString, IsNumber, IsDateString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { BloodGroup } from '../../schemas/user.schema';
import { AlertPriority } from '../../schemas/alert.schema';

export class CreateAlertDto {
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsNumber()
  @Min(1)
  @Max(50)
  unitsNeeded: number;

  @IsEnum(AlertPriority)
  priority: AlertPriority;

  @IsString()
  patientCondition: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsDateString()
  requiredBy: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  searchRadius?: number;

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;
}