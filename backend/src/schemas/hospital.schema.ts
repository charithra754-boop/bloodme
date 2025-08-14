import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BloodGroup } from './user.schema';

export type HospitalDocument = Hospital & Document;

@Schema({ timestamps: true })
export class Hospital {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  hospitalName: string;

  @Prop({ required: true })
  licenseNumber: string;

  @Prop({ required: true })
  contactPerson: string;

  @Prop({ required: true })
  emergencyContact: string;

  @Prop({
    type: Map,
    of: Number,
    default: new Map([
      [BloodGroup.A_POSITIVE, 0],
      [BloodGroup.A_NEGATIVE, 0],
      [BloodGroup.B_POSITIVE, 0],
      [BloodGroup.B_NEGATIVE, 0],
      [BloodGroup.AB_POSITIVE, 0],
      [BloodGroup.AB_NEGATIVE, 0],
      [BloodGroup.O_POSITIVE, 0],
      [BloodGroup.O_NEGATIVE, 0],
    ])
  })
  bloodInventory: Map<BloodGroup, number>;

  @Prop({ default: 50 }) // Default capacity in units
  totalCapacity: number;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: [] })
  specialties: string[];

  @Prop()
  website: string;

  @Prop({ default: 0 })
  totalAlertsRaised: number;

  @Prop({ default: 0 })
  successfulMatches: number;
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);