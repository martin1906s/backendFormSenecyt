import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { EmptyStringToUndefinedPipe } from './common/pipes/empty-string-to-undefined.pipe';

//Cors
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new EmptyStringToUndefinedPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: [
      'https://forms-senecyt.vercel.app',
      'https://forms-senecyt-git-main-martin1906s.vercel.app',
      'https://admin-forms-movilis-krake.vercel.app',
      'https://admin-forms-movilis-krake-git-main-martin1906s.vercel.app', // Branch deployments
      'http://localhost:4200',
      'http://localhost:3000',
      'http://localhost:52505',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
