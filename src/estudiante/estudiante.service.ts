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
  TipoSangre,
  Discapacidad,
  TipoDiscapacidad,
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

  async getPueblosYNacionalidades() {
    const result = await this.prisma.puebloYNacionalidad.findMany({
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
    });
    console.log('Pueblos y Nacionalidades desde DB:', result.length, 'registros');
    return result;
  }

  async getPaises() {
    return this.prisma.pais.findMany({
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
    });
  }

  async getProvincias() {
    return this.prisma.provincia.findMany({
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        paisId: true,
      },
    });
  }

  async getCantones() {
    return this.prisma.canton.findMany({
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        provinciaId: true,
      },
    });
  }

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
      tipoSangre: firstEnum(TipoSangre),
      discapacidad: firstEnum(Discapacidad),
      porcentajeDiscapacidad: 'NA',
      numCarnetConadis: 'NA',
      tipoDiscapacidad: firstEnum(TipoDiscapacidad),
      fechaNacimiento: 'NA',
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

      // Extraer campos de relación para manejarlos por separado
      const nacionalidadId = dataToCreate.nacionalidadId;
      const puebloId = dataToCreate.puebloId;
      const sectorEconomicoId = dataToCreate.sectorEconomicoId;
      const paisNacionalidadId = dataToCreate.paisNacionalidadId;
      const provinciaNacimientoId = dataToCreate.provinciaNacimientoId;
      const cantonNacimientoId = dataToCreate.cantonNacimientoId;
      const paisResidenciaId = dataToCreate.paisResidenciaId;
      const provinciaResidenciaId = dataToCreate.provinciaResidenciaId;
      const cantonResidenciaId = dataToCreate.cantonResidenciaId;

      // Eliminar campos de relación del objeto principal
      delete dataToCreate.nacionalidadId;
      delete dataToCreate.puebloId;
      delete dataToCreate.sectorEconomicoId;
      delete dataToCreate.paisNacionalidadId;
      delete dataToCreate.provinciaNacimientoId;
      delete dataToCreate.cantonNacimientoId;
      delete dataToCreate.paisResidenciaId;
      delete dataToCreate.provinciaResidenciaId;
      delete dataToCreate.cantonResidenciaId;

      // Agregar relaciones usando sintaxis de Prisma connect
      if (nacionalidadId && nacionalidadId !== '' && nacionalidadId !== 'NA') {
        dataToCreate.PuebloYNacionalidad_Estudiante_nacionalidadIdToPuebloYNacionalidad = { connect: { id: nacionalidadId } };
      }
      if (puebloId && puebloId !== '' && puebloId !== 'NA') {
        dataToCreate.PuebloYNacionalidad_Estudiante_puebloIdToPuebloYNacionalidad = { connect: { id: puebloId } };
      }
      if (sectorEconomicoId && sectorEconomicoId !== '' && sectorEconomicoId !== 'NA') {
        dataToCreate.SectorEconomico = { connect: { id: sectorEconomicoId } };
      }
      if (paisNacionalidadId && paisNacionalidadId !== '' && paisNacionalidadId !== 'NA') {
        dataToCreate.Pais_Estudiante_paisNacionalidadIdToPais = { connect: { id: paisNacionalidadId } };
      }
      if (provinciaNacimientoId && provinciaNacimientoId !== '' && provinciaNacimientoId !== 'NA') {
        dataToCreate.Provincia_Estudiante_provinciaNacimientoIdToProvincia = { connect: { id: provinciaNacimientoId } };
      }
      if (cantonNacimientoId && cantonNacimientoId !== '' && cantonNacimientoId !== 'NA') {
        dataToCreate.Canton_Estudiante_cantonNacimientoIdToCanton = { connect: { id: cantonNacimientoId } };
      }
      if (paisResidenciaId && paisResidenciaId !== '' && paisResidenciaId !== 'NA') {
        dataToCreate.Pais_Estudiante_paisResidenciaIdToPais = { connect: { id: paisResidenciaId } };
      }
      if (provinciaResidenciaId && provinciaResidenciaId !== '' && provinciaResidenciaId !== 'NA') {
        dataToCreate.Provincia_Estudiante_provinciaResidenciaIdToProvincia = { connect: { id: provinciaResidenciaId } };
      }
      if (cantonResidenciaId && cantonResidenciaId !== '' && cantonResidenciaId !== 'NA') {
        dataToCreate.Canton_Estudiante_cantonResidenciaIdToCanton = { connect: { id: cantonResidenciaId } };
      }

      if (composicionFamiliar?.length) {
        dataToCreate.ComposicionFamiliar = { create: composicionFamiliar.map((r) => ({
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
        dataToCreate.IngresoFamiliar = { create: ingresosFamiliares.map((r) => ({
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
        include: { ComposicionFamiliar: true, IngresoFamiliar: true },
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
      include: { ComposicionFamiliar: true, IngresoFamiliar: true },
    });
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id },
      include: { 
        ComposicionFamiliar: true, 
        IngresoFamiliar: true,
        PuebloYNacionalidad_Estudiante_nacionalidadIdToPuebloYNacionalidad: true,
        PuebloYNacionalidad_Estudiante_puebloIdToPuebloYNacionalidad: true,
        Pais_Estudiante_paisNacionalidadIdToPais: true,
        Pais_Estudiante_paisResidenciaIdToPais: true,
        Provincia_Estudiante_provinciaNacimientoIdToProvincia: true,
        Provincia_Estudiante_provinciaResidenciaIdToProvincia: true,
        Canton_Estudiante_cantonNacimientoIdToCanton: true,
        Canton_Estudiante_cantonResidenciaIdToCanton: true,
        SectorEconomico: true,
      },
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
      include: { 
        ComposicionFamiliar: true, 
        IngresoFamiliar: true,
        PuebloYNacionalidad_Estudiante_nacionalidadIdToPuebloYNacionalidad: true,
        PuebloYNacionalidad_Estudiante_puebloIdToPuebloYNacionalidad: true,
        Pais_Estudiante_paisNacionalidadIdToPais: true,
        Pais_Estudiante_paisResidenciaIdToPais: true,
        Provincia_Estudiante_provinciaNacimientoIdToProvincia: true,
        Provincia_Estudiante_provinciaResidenciaIdToProvincia: true,
        Canton_Estudiante_cantonNacimientoIdToCanton: true,
        Canton_Estudiante_cantonResidenciaIdToCanton: true,
        SectorEconomico: true,
      },
    });

    // Si no existe, devolver null (200) para que el front pueda llenar el formulario desde cero
    return estudiante ?? null;
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

      // Extraer campos de relación para manejarlos por separado
      const nacionalidadId = data.nacionalidadId;
      const puebloId = data.puebloId;
      const sectorEconomicoId = data.sectorEconomicoId;
      const paisNacionalidadId = data.paisNacionalidadId;
      const provinciaNacimientoId = data.provinciaNacimientoId;
      const cantonNacimientoId = data.cantonNacimientoId;
      const paisResidenciaId = data.paisResidenciaId;
      const provinciaResidenciaId = data.provinciaResidenciaId;
      const cantonResidenciaId = data.cantonResidenciaId;

      // Eliminar campos de relación del objeto principal
      delete data.nacionalidadId;
      delete data.puebloId;
      delete data.sectorEconomicoId;
      delete data.paisNacionalidadId;
      delete data.provinciaNacimientoId;
      delete data.cantonNacimientoId;
      delete data.paisResidenciaId;
      delete data.provinciaResidenciaId;
      delete data.cantonResidenciaId;

      // Agregar relaciones usando sintaxis de Prisma connect/disconnect
      if (nacionalidadId !== undefined) {
        if (nacionalidadId && nacionalidadId !== '' && nacionalidadId !== 'NA') {
          data.PuebloYNacionalidad_Estudiante_nacionalidadIdToPuebloYNacionalidad = { connect: { id: nacionalidadId } };
        } else {
          data.PuebloYNacionalidad_Estudiante_nacionalidadIdToPuebloYNacionalidad = { disconnect: true };
        }
      }
      if (puebloId !== undefined) {
        if (puebloId && puebloId !== '' && puebloId !== 'NA') {
          data.PuebloYNacionalidad_Estudiante_puebloIdToPuebloYNacionalidad = { connect: { id: puebloId } };
        } else {
          data.PuebloYNacionalidad_Estudiante_puebloIdToPuebloYNacionalidad = { disconnect: true };
        }
      }
      if (sectorEconomicoId !== undefined) {
        if (sectorEconomicoId && sectorEconomicoId !== '' && sectorEconomicoId !== 'NA') {
          data.SectorEconomico = { connect: { id: sectorEconomicoId } };
        } else {
          data.SectorEconomico = { disconnect: true };
        }
      }
      if (paisNacionalidadId !== undefined) {
        if (paisNacionalidadId && paisNacionalidadId !== '' && paisNacionalidadId !== 'NA') {
          data.Pais_Estudiante_paisNacionalidadIdToPais = { connect: { id: paisNacionalidadId } };
        } else {
          data.Pais_Estudiante_paisNacionalidadIdToPais = { disconnect: true };
        }
      }
      if (provinciaNacimientoId !== undefined) {
        if (provinciaNacimientoId && provinciaNacimientoId !== '' && provinciaNacimientoId !== 'NA') {
          data.Provincia_Estudiante_provinciaNacimientoIdToProvincia = { connect: { id: provinciaNacimientoId } };
        } else {
          data.Provincia_Estudiante_provinciaNacimientoIdToProvincia = { disconnect: true };
        }
      }
      if (cantonNacimientoId !== undefined) {
        if (cantonNacimientoId && cantonNacimientoId !== '' && cantonNacimientoId !== 'NA') {
          data.Canton_Estudiante_cantonNacimientoIdToCanton = { connect: { id: cantonNacimientoId } };
        } else {
          data.Canton_Estudiante_cantonNacimientoIdToCanton = { disconnect: true };
        }
      }
      if (paisResidenciaId !== undefined) {
        if (paisResidenciaId && paisResidenciaId !== '' && paisResidenciaId !== 'NA') {
          data.Pais_Estudiante_paisResidenciaIdToPais = { connect: { id: paisResidenciaId } };
        } else {
          data.Pais_Estudiante_paisResidenciaIdToPais = { disconnect: true };
        }
      }
      if (provinciaResidenciaId !== undefined) {
        if (provinciaResidenciaId && provinciaResidenciaId !== '' && provinciaResidenciaId !== 'NA') {
          data.Provincia_Estudiante_provinciaResidenciaIdToProvincia = { connect: { id: provinciaResidenciaId } };
        } else {
          data.Provincia_Estudiante_provinciaResidenciaIdToProvincia = { disconnect: true };
        }
      }
      if (cantonResidenciaId !== undefined) {
        if (cantonResidenciaId && cantonResidenciaId !== '' && cantonResidenciaId !== 'NA') {
          data.Canton_Estudiante_cantonResidenciaIdToCanton = { connect: { id: cantonResidenciaId } };
        } else {
          data.Canton_Estudiante_cantonResidenciaIdToCanton = { disconnect: true };
        }
      }

      if (Array.isArray(composicionFamiliar)) {
        await this.prisma.composicionFamiliar.deleteMany({ where: { estudianteId: id } });
        if (composicionFamiliar.length > 0) {
          data.ComposicionFamiliar = {
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
          data.IngresoFamiliar = {
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
        include: { ComposicionFamiliar: true, IngresoFamiliar: true },
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

