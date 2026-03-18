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

  // CORS primero para que todas las respuestas (incl. errores) incluyan los headers
  const allowedOrigins = [
    'https://forms-senecyt.vercel.app',
    'https://forms-senecyt-git-main-martin1906s.vercel.app',
    'https://admin-forms-movilis-krake.vercel.app',
    'https://admin-forms-movilis-krake-git-main-martin1906s.vercel.app',
    'http://localhost:4200',
    'http://localhost:3000',
    'http://localhost:3008',
    'http://localhost:52505',
    'http://localhost:56352',
    'http://localhost:62863',
    'http://localhost:51775',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      const allowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost(:\d+)?$/.test(origin);
      callback(null, allowed);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new EmptyStringToUndefinedPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3008);
}
bootstrap();
