import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import {
  TipoDocumento,
  Sexo,
  Genero,
  EstadoCivil,
  Etnia,
  PuebloNacionalidad,
  TipoSangre,
  Discapacidad,
  TipoDiscapacidad,
  Pais,
  TipoColegio,
  ModalidadCarrera,
  JornadaCarrera,
  TipoMatricula,
  NivelAcademico,
  HaRepetidoAlMenosUnaMateria,
  HaPerdidoLaGratuidad,
  Paralelo,
  RecibePensionDiferenciada,
  EstudianteOcupacion,
  IngresosEstudiante,
  BonoDesarrollo,
  HaRealizadoPracticasPreprofesionales,
  EntornoInstitucionalPracticasProfesionales,
  SectorEconomicoPracticaProfesional,
  TipoBeca,
  PrimeraRazonBeca,
  SegundaRazonBeca,
  TerceraRazonBeca,
  CuartaRazonBeca,
  QuintaRazonBeca,
  SextaRazonBeca,
  ParticipaEnProyectoVinculacionSociedad,
  NivelFormacionPadre,
  NivelFormacionMadre,
} from '@prisma/client';

/** Primer valor de un enum para usar como valor por defecto en borrador */
function firstEnum<T extends Record<string, string>>(e: T): T[keyof T] {
  const values = Object.values(e) as T[keyof T][];
  return values[0];
}

@Injectable()
export class EstudianteService {
  constructor(private prisma: PrismaService) {}

  /** Valores por defecto para crear un borrador cuando aún no existe el estudiante */
  private getDefaultsForCreate(tipoDocumento: TipoDocumento, numeroIdentificacion: string): Record<string, unknown> {
    return {
      tipoDocumento,
      numeroIdentificacion,
      primerApellido: 'NA',
      segundoApellido: 'NA',
      primerNombre: 'NA',
      segundoNombre: 'NA',
      sexo: firstEnum(Sexo),
      genero: firstEnum(Genero),
      estadoCivil: firstEnum(EstadoCivil),
      etnia: firstEnum(Etnia),
      puebloNacionalidad: firstEnum(PuebloNacionalidad),
      tipoSangre: firstEnum(TipoSangre),
      discapacidad: firstEnum(Discapacidad),
      porcentajeDiscapacidad: 'NA',
      numCarnetConadis: 'NA',
      tipoDiscapacidad: firstEnum(TipoDiscapacidad),
      fechaNacimiento: 'NA',
      paisNacionalidadId: firstEnum(Pais),
      provinciaNacimientoId: null,
      cantonNacimientoId: 'NA',
      paisResidenciaId: firstEnum(Pais),
      provinciaResidenciaId: null,
      cantonResidenciaId: 'NA',
      tipoColegioId: firstEnum(TipoColegio),
      modalidadCarrera: firstEnum(ModalidadCarrera),
      jornadaCarrera: firstEnum(JornadaCarrera),
      fechaInicioCarrera: 'NA',
      fechaMatricula: 'NA',
      tipoMatricula: firstEnum(TipoMatricula),
      duracionPeriodoAcademico: 1,
      nivelAcademico: firstEnum(NivelAcademico),
      haRepetidoAlMenosUnaMateria: firstEnum(HaRepetidoAlMenosUnaMateria),
      paralelo: firstEnum(Paralelo),
      haPerdidoLaGratuidad: firstEnum(HaPerdidoLaGratuidad),
      recibePensionDiferenciada: firstEnum(RecibePensionDiferenciada),
      estudianteOcupacion: firstEnum(EstudianteOcupacion),
      ingresosEstudiante: firstEnum(IngresosEstudiante),
      bonoDesarrollo: firstEnum(BonoDesarrollo),
      haRealizadoPracticasPreprofesionales: firstEnum(HaRealizadoPracticasPreprofesionales),
      nroHorasPracticasPreprofesionalesPorPeriodo: 'NA',
      entornoInstitucionalPracticasProfesionales: firstEnum(EntornoInstitucionalPracticasProfesionales),
      sectorEconomicoPracticaProfesional: firstEnum(SectorEconomicoPracticaProfesional),
      tipoBeca: firstEnum(TipoBeca),
      primeraRazonBeca: firstEnum(PrimeraRazonBeca),
      segundaRazonBeca: firstEnum(SegundaRazonBeca),
      terceraRazonBeca: firstEnum(TerceraRazonBeca),
      cuartaRazonBeca: firstEnum(CuartaRazonBeca),
      quintaRazonBeca: firstEnum(QuintaRazonBeca),
      sextaRazonBeca: firstEnum(SextaRazonBeca),
      montoBeca: 'NA',
      porcentajeBecaCoberturaArancel: 'NA',
      porcentajeBecaCoberturaManutencion: 'NA',
      montoAyudaEconomica: 'NA',
      montoCreditoEducativo: 'NA',
      participaEnProyectoVinculacionSociedad: firstEnum(ParticipaEnProyectoVinculacionSociedad),
      correoElectronico: 'NA',
      numeroCelular: '0000000000',
      nivelFormacionPadre: firstEnum(NivelFormacionPadre),
      nivelFormacionMadre: firstEnum(NivelFormacionMadre),
      ingresoTotalHogar: 'NA',
      cantidadMiembrosHogar: 1,
      composicionFamiliar: [],
      ingresosFamiliares: [],
    };
  }

  /**
   * Guarda el paso actual: si ya existe el estudiante (por cédula) actualiza; si no, crea un borrador con datos enviados + defaults.
   */
  async guardarPaso(dto: UpdateEstudianteDto) {
    const tipoDocumento = (dto as any).tipoDocumento;
    const numeroIdentificacion = (dto as any).numeroIdentificacion;
    if (!tipoDocumento || !numeroIdentificacion) {
      throw new BadRequestException('Se requieren tipoDocumento y numeroIdentificacion para guardar el paso.');
    }
    const existing = await this.prisma.estudiante.findUnique({
      where: {
        numeroIdentificacion_tipoDocumento: {
          numeroIdentificacion: String(numeroIdentificacion),
          tipoDocumento: tipoDocumento as TipoDocumento,
        },
      },
    });
    if (existing) {
      return this.update(existing.id, dto);
    }
    const defaults = this.getDefaultsForCreate(tipoDocumento as TipoDocumento, String(numeroIdentificacion));
    const merged: any = { ...defaults };
    for (const k of Object.keys(dto)) {
      const v = (dto as any)[k];
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) {
        merged[k] = v;
        continue;
      }
      if (typeof v === 'string' && v.trim() === '') continue;
      merged[k] = v;
    }
    return this.create(merged as CreateEstudianteDto);
  }

  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      const { composicionFamiliar, ingresosFamiliares, ...estudianteData } = createEstudianteDto as CreateEstudianteDto & {
        composicionFamiliar?: Array<Record<string, string>>;
        ingresosFamiliares?: Array<Record<string, string>>;
      };
      const dataToCreate = { ...estudianteData } as any;

      // Asegurar que cuando el país no es Ecuador, las provincias sean undefined (null en DB) y los cantones sean 'NA'
      if (dataToCreate.paisNacionalidadId !== 'ECUADOR') {
        dataToCreate.provinciaNacimientoId = undefined;
        dataToCreate.cantonNacimientoId = 'NA';
      }
      if (dataToCreate.paisResidenciaId !== 'ECUADOR') {
        dataToCreate.provinciaResidenciaId = undefined;
        dataToCreate.cantonResidenciaId = 'NA';
      }

      if (composicionFamiliar?.length) {
        dataToCreate.composicionFamiliar = { create: composicionFamiliar.map((r) => ({
          nombresApellidos: r.nombresApellidos ?? 'NA',
          fechaNacimiento: r.fechaNacimiento ?? 'NA',
          cedulaIdentidad: r.cedulaIdentidad ?? 'NA',
          estadoCivil: r.estadoCivil ?? 'NA',
          parentesco: r.parentesco ?? 'NA',
          nivelEstudios: r.nivelEstudios ?? 'NA',
          titulo: r.titulo ?? 'NA',
          laborOcupacion: r.laborOcupacion ?? 'NA',
        })) };
      }
      if (ingresosFamiliares?.length) {
        dataToCreate.ingresosFamiliares = { create: ingresosFamiliares.map((r) => ({
          nombresApellidos: r.nombresApellidos ?? 'NA',
          parentesco: r.parentesco ?? 'NA',
          actividadLaboral: r.actividadLaboral ?? 'NA',
          ingresoMensual: r.ingresoMensual ?? 'NA',
          ingresosExtras: r.ingresosExtras ?? 'NA',
          total: r.total ?? 'NA',
        })) };
      }

      console.log('Creando estudiante con datos:', JSON.stringify(dataToCreate, null, 2));
      const result = await this.prisma.estudiante.create({
        data: dataToCreate,
        include: { composicionFamiliar: true, ingresosFamiliares: true },
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
      orderBy: { id: 'desc' },
      include: { composicionFamiliar: true, ingresosFamiliares: true },
    });
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id },
      include: { composicionFamiliar: true, ingresosFamiliares: true },
    });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return estudiante;
  }

  async findOneByCedula(tipoDocumento: string, numeroIdentificacion: string) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        numeroIdentificacion_tipoDocumento: {
          numeroIdentificacion,
          tipoDocumento: tipoDocumento as any,
        },
      },
      include: { composicionFamiliar: true, ingresosFamiliares: true },
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

      const { composicionFamiliar, ingresosFamiliares, ...rest } = updateEstudianteDto as UpdateEstudianteDto & {
        composicionFamiliar?: Array<Record<string, string>>;
        ingresosFamiliares?: Array<Record<string, string>>;
      };

      const data: any = { ...rest };

      if (Array.isArray(composicionFamiliar)) {
        await this.prisma.composicionFamiliar.deleteMany({ where: { estudianteId: id } });
        if (composicionFamiliar.length > 0) {
          data.composicionFamiliar = {
            create: composicionFamiliar.map((r) => ({
              nombresApellidos: r.nombresApellidos ?? 'NA',
              fechaNacimiento: r.fechaNacimiento ?? 'NA',
              cedulaIdentidad: r.cedulaIdentidad ?? 'NA',
              estadoCivil: r.estadoCivil ?? 'NA',
              parentesco: r.parentesco ?? 'NA',
              nivelEstudios: r.nivelEstudios ?? 'NA',
              titulo: r.titulo ?? 'NA',
              laborOcupacion: r.laborOcupacion ?? 'NA',
            })),
          };
        }
      }
      if (Array.isArray(ingresosFamiliares)) {
        await this.prisma.ingresoFamiliar.deleteMany({ where: { estudianteId: id } });
        if (ingresosFamiliares.length > 0) {
          data.ingresosFamiliares = {
            create: ingresosFamiliares.map((r) => ({
              nombresApellidos: r.nombresApellidos ?? 'NA',
              parentesco: r.parentesco ?? 'NA',
              actividadLaboral: r.actividadLaboral ?? 'NA',
              ingresoMensual: r.ingresoMensual ?? 'NA',
              ingresosExtras: r.ingresosExtras ?? 'NA',
              total: r.total ?? 'NA',
            })),
          };
        }
      }

      return await this.prisma.estudiante.update({
        where: { id },
        data,
        include: { composicionFamiliar: true, ingresosFamiliares: true },
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

