import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(private prisma: PrismaService) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      // Asegurar que cuando el país no es Ecuador, las provincias sean undefined (null en DB) y los cantones sean 'NA'
      const dataToCreate = { ...createEstudianteDto };
      
      // Para nacimiento
      if (dataToCreate.paisNacionalidadId !== 'ECUADOR') {
        dataToCreate.provinciaNacimientoId = undefined;
        dataToCreate.cantonNacimientoId = 'NA';
      }
      
      // Para residencia
      if (dataToCreate.paisResidenciaId !== 'ECUADOR') {
        dataToCreate.provinciaResidenciaId = undefined;
        dataToCreate.cantonResidenciaId = 'NA';
      }
      
      console.log('Creando estudiante con datos:', JSON.stringify(dataToCreate, null, 2));
      const result = await this.prisma.estudiante.create({
        data: dataToCreate,
      });
      console.log('Estudiante creado exitosamente:', result.id);
      return result;
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error meta:', error.meta);
      
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un estudiante con esta identificación y tipo de documento',
        );
      }
      if (error.code === 'P1001') {
        // Error de conexión a la base de datos
        throw new InternalServerErrorException(
          'Error de conexión a la base de datos. Verifica que DATABASE_URL esté configurada correctamente en Railway y que la base de datos esté accesible.',
        );
      }
      if (error.code === 'ENETUNREACH' || error.code === 'ECONNREFUSED') {
        throw new InternalServerErrorException(
          'Error de conexión a la base de datos. Verifica que DATABASE_URL esté configurada correctamente en Railway.',
        );
      }
      // Lanzar error con más información para debugging
      throw new InternalServerErrorException(
        `Error al crear estudiante: ${error.message || 'Error desconocido'}. Code: ${error.code || 'N/A'}. Meta: ${JSON.stringify(error.meta || {})}`,
      );
    }
  }

  async findAll() {
    return await this.prisma.estudiante.findMany({
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

  async remove(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    return await this.prisma.estudiante.delete({
      where: { id },
    });
  }
}

