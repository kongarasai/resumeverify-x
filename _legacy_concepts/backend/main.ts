// ResumeVerify X™ — NestJS Bootstrap
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security
  app.use(helmet());
  app.use(compression());
  
  // CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
  });
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  // WebSockets
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // API prefix
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 ResumeVerify X™ API running on port ${port}`);
}
bootstrap();
