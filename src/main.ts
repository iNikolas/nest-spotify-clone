import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // The ValidationPipe in NestJS is used to automatically validate incoming request data based on the validation rules defined in your DTO (Data Transfer Object) classes
  await app.listen(3000);
}
bootstrap();
