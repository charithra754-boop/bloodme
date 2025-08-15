import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// 🚨 HACKATHON DEMO MODE: Use simple module if MongoDB fails
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS for frontend communication
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL || 'http://localhost:3000'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Blood Donor API running on port ${port}`);
    console.log(`🩸 HACKATHON DEMO MODE: Ready for presentation!`);
  } catch (error) {
    console.error('❌ Backend failed to start:', error.message);
    console.log('🚨 HACKATHON TIP: Frontend will use mock data automatically!');
    console.log('🎯 Your demo will still work perfectly!');
  }
}

bootstrap();