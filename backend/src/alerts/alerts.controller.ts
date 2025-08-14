import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AlertsService } from "./alerts.service";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { RespondToAlertDto } from "./dto/respond-to-alert.dto";
import { AlertStatus } from "../schemas/alert.schema";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../schemas/user.schema";

@Controller("alerts")
@UseGuards(AuthGuard("jwt"))
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @Roles(UserRole.HOSPITAL)
  @UseGuards(RolesGuard)
  create(@Body() createAlertDto: CreateAlertDto, @Request() req) {
    return this.alertsService.createAlert(createAlertDto, req.user.id);
  }

  @Get("active")
  getActiveAlerts() {
    return this.alertsService.getActiveAlerts();
  }

  @Get("hospital")
  @Roles(UserRole.HOSPITAL)
  @UseGuards(RolesGuard)
  getHospitalAlerts(@Request() req, @Query("status") status?: AlertStatus) {
    return this.alertsService.getAlertsByHospital(req.user.id, status);
  }

  @Post(":id/respond")
  @Roles(UserRole.DONOR)
  @UseGuards(RolesGuard)
  respondToAlert(
    @Param("id") id: string,
    @Body() responseDto: RespondToAlertDto,
    @Request() req
  ) {
    return this.alertsService.respondToAlert(id, req.user.id, responseDto);
  }

  @Patch(":id/status")
  @Roles(UserRole.HOSPITAL)
  @UseGuards(RolesGuard)
  updateAlertStatus(
    @Param("id") id: string,
    @Body("status") status: AlertStatus,
    @Request() req
  ) {
    return this.alertsService.updateAlertStatus(id, status, req.user.id);
  }
}
