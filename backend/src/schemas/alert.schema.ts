import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BloodGroup } from './user.schema';

export type AlertDocument = Alert & Document;

export enum AlertStatus {
  ACTIVE = 'active',
  FULFILLED = 'fulfilled',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ResponseStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class DonorResponse {
  @Prop({ type: Types.ObjectId, ref: 'Donor', required: true })
  donorId: Types.ObjectId;

  @Prop({ required: true, enum: ResponseStatus, default: ResponseStatus.PENDING })
  status: ResponseStatus;

  @Prop({ default: Date.now })
  responseTime: Date;

  @Prop()
  estimatedArrival: Date;

  @Prop()
  notes: string;
}

@Schema({ timestamps: true })
export class Alert {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId: Types.ObjectId;

  @Prop({ required: true, enum: BloodGroup })
  bloodGroup: BloodGroup;

  @Prop({ required: true })
  unitsNeeded: number;

  @Prop({ required: true, enum: AlertPriority })
  priority: AlertPriority;

  @Prop({ required: true, enum: AlertStatus, default: AlertStatus.ACTIVE })
  status: AlertStatus;

  @Prop({ required: true })
  patientCondition: string;

  @Prop()
  additionalNotes: string;

  @Prop({ required: true })
  requiredBy: Date;

  @Prop({ default: 5 }) // Default search radius in km
  searchRadius: number;

  @Prop({ type: [DonorResponse], default: [] })
  responses: DonorResponse[];

  @Prop({ type: [Types.ObjectId], ref: 'Donor', default: [] })
  notifiedDonors: Types.ObjectId[];

  @Prop({ default: 0 })
  unitsCollected: number;

  @Prop()
  expiresAt: Date;

  @Prop({ default: false })
  isEmergency: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

// Index for efficient querying
AlertSchema.index({ status: 1, bloodGroup: 1, createdAt: -1 });
AlertSchema.index({ hospitalId: 1, status: 1 });
AlertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });