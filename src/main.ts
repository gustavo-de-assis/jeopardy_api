import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  mongoose.set('debug', true);
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for the Flutter app
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0'); // Bind to all interfaces
}
bootstrap();
