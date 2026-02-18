import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

const CONNECTION_ERROR_CODES = new Set([
  'ENETUNREACH',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'P1001', // Can't reach database server
  'P1017', // Server has closed the connection
]);

const AUTH_ERROR_CODES = new Set([
  'P1000', // Authentication failed (e.g. wrong user/password)
]);

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const code = (exception as unknown as { code?: string }).code;

    if (code && CONNECTION_ERROR_CODES.has(code)) {
      this.logger.warn(
        `Database connection error (${code}): ${exception.message}`,
      );
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service Unavailable',
        message:
          'No se pudo conectar a la base de datos. En Render, usa DATABASE_URL del Connection Pooler de Supabase (puerto 6543).',
      });
      return;
    }

    if (code && AUTH_ERROR_CODES.has(code)) {
      this.logger.warn(`Database auth error (${code}): ${exception.message}`);
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service Unavailable',
        message:
          'Credenciales de base de datos inválidas. En Render con Supabase pooler, usa la URI completa: usuario postgres.[PROJECT-REF] y la contraseña de Database. Ver RENDER_DATABASE.md.',
      });
      return;
    }

    // Resto de errores de Prisma → 500
    this.logger.error(exception.message, exception.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Error en la base de datos.',
    });
  }
}
