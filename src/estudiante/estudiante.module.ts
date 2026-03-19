import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseStorageService } from './supabase-storage.service';

@Module({
  imports: [PrismaModule],
  controllers: [EstudianteController],
  providers: [EstudianteService, SupabaseStorageService],
})
export class EstudianteModule {}

