import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DonorsService } from './donors.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';

@Controller('donors')
@UseGuards(AuthGuard('jwt'))
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get('profile')
  @Roles(UserRole.DONOR)
  @UseGuards(RolesGuard)
  getProfile(@Request() req) {
    return this.donorsService.getProfile(req.user.id);
  }

  @Patch('profile')
  @Roles(UserRole.DONOR)
  @UseGuards(RolesGuard)
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.donorsService.updateProfile(req.user.id, updateData);
  }

  @Patch('fcm-token')
  @Roles(UserRole.DONOR)
  @UseGuards(RolesGuard)
  updateFCMToken(@Request() req, @Body('fcmToken') fcmToken: string) {
    return this.donorsService.updateFCMToken(req.user.id, fcmToken);
  }
}