import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Donor, DonorDocument } from '../schemas/donor.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class DonorsService {
  constructor(
    @InjectModel(Donor.name) private donorModel: Model<DonorDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getProfile(userId: string) {
    const donor = await this.donorModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId');
    
    if (!donor) {
      throw new NotFoundException('Donor profile not found');
    }

    return donor;
  }

  async updateProfile(userId: string, updateData: any) {
    const donor = await this.donorModel.findOne({ 
      userId: new Types.ObjectId(userId) 
    });
    
    if (!donor) {
      throw new NotFoundException('Donor profile not found');
    }

    Object.assign(donor, updateData);
    await donor.save();

    return this.getProfile(userId);
  }

  async updateFCMToken(userId: string, fcmToken: string) {
    const donor = await this.donorModel.findOne({ 
      userId: new Types.ObjectId(userId) 
    });
    
    if (!donor) {
      throw new NotFoundException('Donor profile not found');
    }

    donor.fcmToken = fcmToken;
    await donor.save();

    return { success: true };
  }
}