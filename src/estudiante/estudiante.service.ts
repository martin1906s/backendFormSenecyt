import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(private prisma: PrismaService) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      // Crear o usar el período académico si existe
      await this.prisma.periodoAcademico.upsert({
        where: { id: createEstudianteDto.periodoAcademicoId },
        update: {}, // No actualizar nada si existe
        create: { id: createEstudianteDto.periodoAcademicoId },
      });

      return await this.prisma.estudiante.create({
        data: createEstudianteDto,
        include: {
          periodoAcademico: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un estudiante con esta identificación y tipo de documento',
        );
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `Error con el período académico con ID ${createEstudianteDto.periodoAcademicoId}`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.estudiante.findMany({
      include: {
        periodoAcademico: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOneByCedula(tipoDocumento: string, numeroIdentificacion: string) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        numeroIdentificacion_tipoDocumento: {
          numeroIdentificacion,
          tipoDocumento: tipoDocumento as any,
        },
      },
      include: {
        periodoAcademico: true,
      },
    });

    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con cédula ${numeroIdentificacion} y tipo ${tipoDocumento} no encontrado`,
      );
    }

    return estudiante;
  }

  async update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    try {
      const estudiante = await this.prisma.estudiante.findUnique({
        where: { id },
      });

      if (!estudiante) {
        throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
      }

      return await this.prisma.estudiante.update({
        where: { id },
        data: updateEstudianteDto,
        include: {
          periodoAcademico: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un estudiante con esta identificación y tipo de documento',
        );
      }
      throw error;
    }
  }
}

