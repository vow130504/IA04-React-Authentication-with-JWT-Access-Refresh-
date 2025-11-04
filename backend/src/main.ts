import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow one or many origins via .env FRONTEND_ORIGIN (comma-separated)
  const originEnv = process.env.FRONTEND_ORIGIN;
  const origins =
    originEnv
      ? originEnv.split(',').map((o) => o.trim()).filter(Boolean)
      : true;

  app.enableCors({
    origin: Array.isArray(origins) && origins.length ? origins : true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 3000; // Render sẽ gán PORT runtime
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
}
bootstrap();
