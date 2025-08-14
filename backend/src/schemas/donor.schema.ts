import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BloodGroup } from './user.schema';

export type DonorDocument = Donor & Document;

export enum DonorStatus {
  ELIGIBLE = 'eligible',
  INELIGIBLE = 'ineligible',
  TEMPORARILY_INELIGIBLE = 'temporarily_ineligible',
}

@Schema({ timestamps: true })
export class Donor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: BloodGroup })
  bloodGroup: BloodGroup;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  weight: number; // in kg

  @Prop({ default: DonorStatus.ELIGIBLE, enum: DonorStatus })
  status: DonorStatus;

  @Prop()
  lastDonationDate: Date;

  @Prop({ default: 0 })
  totalDonations: number;

  @Prop({ default: 0 })
  rewardPoints: number;

  @Prop({ default: [] })
  badges: string[];

  @Prop({ default: 'Bronze' })
  tier: string;

  @Prop({ default: true })
  availableForEmergency: boolean;

  @Prop({ default: true })
  notificationsEnabled: boolean;

  @Prop()
  fcmToken: string; // For push notifications

  @Prop({ default: [] })
  medicalConditions: string[];

  @Prop({ default: [] })
  medications: string[];
}

export const DonorSchema = SchemaFactory.createForClass(Donor);