import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { CatalogosModule } from './catalogos/catalogos.module';

@Module({
  imports: [PrismaModule, EstudianteModule, CatalogosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
