import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hospital, HospitalDocument } from '../schemas/hospital.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getProfile(userId: string) {
    const hospital = await this.hospitalModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId');
    
    if (!hospital) {
      throw new NotFoundException('Hospital profile not found');
    }

    return hospital;
  }

  async updateProfile(userId: string, updateData: any) {
    const hospital = await this.hospitalModel.findOne({ 
      userId: new Types.ObjectId(userId) 
    });
    
    if (!hospital) {
      throw new NotFoundException('Hospital profile not found');
    }

    Object.assign(hospital, updateData);
    await hospital.save();

    return this.getProfile(userId);
  }

  async updateInventory(userId: string, inventory: Record<string, number>) {
    const hospital = await this.hospitalModel.findOne({ 
      userId: new Types.ObjectId(userId) 
    });
    
    if (!hospital) {
      throw new NotFoundException('Hospital profile not found');
    }

    // Convert to proper Map with BloodGroup keys
    const inventoryMap = new Map();
    Object.entries(inventory).forEach(([key, value]) => {
      inventoryMap.set(key as any, value);
    });
    
    hospital.bloodInventory = inventoryMap;
    await hospital.save();

    return this.getProfile(userId);
  }
}