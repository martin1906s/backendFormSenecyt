import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { SupabaseStorageService } from './supabase-storage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EstudianteController],
  providers: [EstudianteService, SupabaseStorageService],
})
export class EstudianteModule {}

