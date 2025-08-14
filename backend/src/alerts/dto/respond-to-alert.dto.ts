import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';
import { ResponseStatus } from '../../schemas/alert.schema';

export class RespondToAlertDto {
  @IsEnum(ResponseStatus)
  status: ResponseStatus;

  @IsOptional()
  @IsDateString()
  estimatedArrival?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}