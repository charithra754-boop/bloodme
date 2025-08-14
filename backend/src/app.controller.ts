import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): any {
    return {
      message: '🩸 Blood Donor & Alert System API is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/auth/login, /auth/register',
        alerts: '/alerts/active, /alerts/hospital',
        donors: '/donors/profile',
        hospitals: '/hospitals/profile'
      }
    };
  }

  @Get('health')
  getHealth(): any {
    return {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    };
  }
}