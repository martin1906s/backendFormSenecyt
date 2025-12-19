import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EstudianteModule } from './estudiante/estudiante.module';

@Module({
  imports: [PrismaModule, EstudianteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
