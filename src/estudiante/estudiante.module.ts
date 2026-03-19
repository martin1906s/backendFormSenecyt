import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Module({
  imports: [PrismaModule],
  controllers: [EstudianteController],
  providers: [EstudianteService, CloudinaryStorageService],
})
export class EstudianteModule {}
