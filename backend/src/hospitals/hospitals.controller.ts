import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HospitalsService } from './hospitals.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';

@Controller('hospitals')
@UseGuards(AuthGuard('jwt'))
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get('profile')
  @Roles(UserRole.HOSPITAL)
  @UseGuards(RolesGuard)
  getProfile(@Request() req) {
    return this.hospitalsService.getProfile(req.user.id);
  }

  @Patch('profile')
  @Roles(UserRole.HOSPITAL)
  @UseGuards(RolesGuard)
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.hospitalsService.updateProfile(req.user.id, updateData);
  }

  @Patch('inventory')
  @Roles(UserRole.HOSPITAL)
  @UseGuards(RolesGuard)
  updateInventory(@Request() req, @Body() inventory: any) {
    return this.hospitalsService.updateInventory(req.user.id, inventory);
  }
}