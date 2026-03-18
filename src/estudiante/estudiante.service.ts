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
      tipoColegioId: undefined, // Opcional: puede ser null para colegios nuevos
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
      // Datos de facturación: por defecto en NA para que no falle hasta que el usuario complete la Fase 2
      tipoComprobante: 'NA',
      facturacionNombre: 'NA',
      facturacionTipoIdentificacion: 'NA',
      facturacionIdentificacion: 'NA',
      facturacionDireccion: 'NA',
      facturacionCorreo: 'NA',
      facturacionTelefono: 'NA',
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

      // Manejar formato especial de estructuraVivienda: "OTRO: [especificación]"
      if (dataToCreate.estructuraVivienda && dataToCreate.estructuraVivienda.startsWith('OTRO: ')) {
        const especificacion = dataToCreate.estructuraVivienda.substring(7); // Remover "OTRO: "
        dataToCreate.estructuraVivienda = 'OTRO';
        // Si no viene estructuraViviendaEspecifique, usar la especificación extraída
        if (!dataToCreate.estructuraViviendaEspecifique || dataToCreate.estructuraViviendaEspecifique === '') {
          dataToCreate.estructuraViviendaEspecifique = especificacion;
        }
      }

      // Normalizar campos de características de vivienda
      // Convertir strings vacíos a "NA" (excepto estructuraViviendaEspecifique que puede ser null)
      const viviendaStringFields = [
        'tipoPropiedadVivienda',
        'estructuraVivienda',
        'tipoVivienda',
        'comparteHabitacion',
        'conQuienVive',
        'tamanoViviendaSuficiente'
      ];

      viviendaStringFields.forEach(field => {
        if (dataToCreate[field] !== undefined && dataToCreate[field] !== null) {
          // Si viene como string vacío, convertir a "NA"
          if (dataToCreate[field] === '') {
            dataToCreate[field] = 'NA';
          }
        } else if (dataToCreate[field] === undefined) {
          // Si no viene, usar "NA" como default
          dataToCreate[field] = 'NA';
        }
      });

      // Manejar estructuraViviendaEspecifique (puede ser null o string vacío)
      if (dataToCreate.estructuraViviendaEspecifique !== undefined) {
        if (dataToCreate.estructuraViviendaEspecifique === '') {
          dataToCreate.estructuraViviendaEspecifique = null;
        }
      } else {
        dataToCreate.estructuraViviendaEspecifique = null;
      }

      // Manejar campos numéricos: si vienen como undefined, no incluirlos (Prisma usará null)
      if (dataToCreate.cantidadBanos === undefined) {
        delete dataToCreate.cantidadBanos;
      }
      if (dataToCreate.cantidadHabitaciones === undefined) {
        delete dataToCreate.cantidadHabitaciones;
      }

      // Normalizar campos de financiamiento
      // Campos booleanos: si vienen como undefined, establecer false como default
      const financiamientoBooleanFields = [
        'financiamientoFondosPropios',
        'financiamientoAyudaPadres',
        'financiamientoTarjetaCredito',
        'financiamientoEntidadFinanciera',
        'financiamientoTercerasPersonas'
      ];

      financiamientoBooleanFields.forEach(field => {
        if (dataToCreate[field] === undefined) {
          dataToCreate[field] = false;
        }
        // Asegurar que sea boolean (por si viene como string "true"/"false")
        if (typeof dataToCreate[field] === 'string') {
          dataToCreate[field] = dataToCreate[field] === 'true';
        }
      });

      // Normalizar financiamientoQuienes: string vacío → "NA"
      if (dataToCreate.financiamientoQuienes !== undefined && dataToCreate.financiamientoQuienes !== null) {
        if (dataToCreate.financiamientoQuienes === '') {
          dataToCreate.financiamientoQuienes = 'NA';
        }
      } else if (dataToCreate.financiamientoQuienes === undefined) {
        dataToCreate.financiamientoQuienes = 'NA';
      }

      // Normalizar copiaCedula y copiaPapeleta: string vacío → "NA"
      if (dataToCreate.copiaCedula !== undefined && dataToCreate.copiaCedula !== null) {
        if (dataToCreate.copiaCedula === '') {
          dataToCreate.copiaCedula = 'NA';
        }
      } else if (dataToCreate.copiaCedula === undefined) {
        dataToCreate.copiaCedula = 'NA';
      }

      if (dataToCreate.copiaPapeleta !== undefined && dataToCreate.copiaPapeleta !== null) {
        if (dataToCreate.copiaPapeleta === '') {
          dataToCreate.copiaPapeleta = 'NA';
        }
      } else if (dataToCreate.copiaPapeleta === undefined) {
        dataToCreate.copiaPapeleta = 'NA';
      }

      // Normalizar certificadoRegistroTitulo: string vacío → "NA"
      if (dataToCreate.certificadoRegistroTitulo !== undefined && dataToCreate.certificadoRegistroTitulo !== null) {
        if (dataToCreate.certificadoRegistroTitulo === '') {
          dataToCreate.certificadoRegistroTitulo = 'NA';
        }
      } else if (dataToCreate.certificadoRegistroTitulo === undefined) {
        dataToCreate.certificadoRegistroTitulo = 'NA';
      }

      // Normalizar tipoColegioId: si viene vacío o undefined, dejarlo como null (para colegios nuevos)
      if (dataToCreate.tipoColegioId !== undefined) {
        if (dataToCreate.tipoColegioId === '' || dataToCreate.tipoColegioId === null) {
          dataToCreate.tipoColegioId = null;
        }
      } else {
        // Si no viene, dejarlo como undefined para que Prisma use null (campo opcional)
        dataToCreate.tipoColegioId = null;
      }

      // Normalizar alergias: si presentaAlergiaImportante !== 'SI', entonces alergias debe ser 'NA'
      if (dataToCreate.presentaAlergiaImportante !== undefined && dataToCreate.presentaAlergiaImportante !== 'SI') {
        if (dataToCreate.alergias !== undefined && dataToCreate.alergias !== null && dataToCreate.alergias !== '' && dataToCreate.alergias !== 'NA') {
          // Si viene con un valor diferente a 'NA' o vacío, normalizar a 'NA'
          dataToCreate.alergias = 'NA';
        } else if (dataToCreate.alergias === undefined || dataToCreate.alergias === null || dataToCreate.alergias === '') {
          dataToCreate.alergias = 'NA';
        }
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
    try {
      return await this.prisma.estudiante.findMany({
        orderBy: { id: 'desc' },
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
    } catch (error) {
      console.error('Error en findAll:', error);
      if (error.code === 'P1001' || error.code === 'P1000') {
        throw new InternalServerErrorException(
          'Error de conexión a la base de datos. Verifica que DATABASE_URL esté configurada correctamente.',
        );
      }
      if (error.code === 'ENETUNREACH' || error.code === 'ECONNREFUSED') {
        throw new InternalServerErrorException(
          'Error de conexión a la base de datos. Verifica que la base de datos esté disponible.',
        );
      }
      throw new InternalServerErrorException(
        `Error en la base de datos: ${error.message || 'Error desconocido'}`,
      );
    }
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

  /**
   * Verifica si un estudiante tiene un registro completo según los 7 pasos de la FICHA ESTUDIANTIL
   * Solo valida los campos críticos de los pasos 1-7 según las instrucciones del frontend
   */
  private verificarRegistroCompleto(estudiante: any): boolean {
    if (!estudiante) return false;

    // Helper para verificar si un valor es válido (no null, no undefined, no vacío, no "NA")
    const esValido = (valor: any): boolean => {
      return valor !== null && valor !== undefined && valor !== '' && valor !== 'NA';
    };

    // Paso 1 - Identificación
    if (!esValido(estudiante.tipoDocumento) || 
        !esValido(estudiante.numeroIdentificacion) || 
        !esValido(estudiante.fechaNacimiento)) {
      return false;
    }

    // Paso 2 - Datos Personales
    if (!esValido(estudiante.primerApellido) || 
        !esValido(estudiante.primerNombre) || 
        !esValido(estudiante.sexo)) {
      return false;
    }

    // Paso 4 - Nacionalidad y Residencia
    if (!esValido(estudiante.paisNacionalidadId) || 
        !esValido(estudiante.provinciaNacimientoId) || 
        !esValido(estudiante.cantonNacimientoId) ||
        !esValido(estudiante.paisResidenciaId) || 
        !esValido(estudiante.provinciaResidenciaId) || 
        !esValido(estudiante.cantonResidenciaId)) {
      return false;
    }

    // Paso 5 - Información Académica
    if (!esValido(estudiante.carrera) || 
        !esValido(estudiante.modalidadCarrera) || 
        !esValido(estudiante.jornadaCarrera)) {
      return false;
    }

    // Paso 10 - Contacto (dentro de los primeros 7 pasos visibles)
    if (!esValido(estudiante.correoElectronico) || 
        !esValido(estudiante.numeroCelular)) {
      return false;
    }

    return true;
  }

  /**
   * Verifica si los datos de facturación están completos (Fase 2 - Paso 13)
   */
  private esFacturacionCompleta(estudiante: any): boolean {
    if (!estudiante) return false;

    const esValido = (valor: any): boolean => {
      return valor !== null && valor !== undefined && valor !== '' && valor !== 'NA';
    };

    if (
      !esValido(estudiante.tipoComprobante) ||
      !esValido(estudiante.facturacionNombre) ||
      !esValido(estudiante.facturacionTipoIdentificacion) ||
      !esValido(estudiante.facturacionIdentificacion) ||
      !esValido(estudiante.facturacionDireccion) ||
      !esValido(estudiante.facturacionCorreo) ||
      !esValido(estudiante.facturacionTelefono)
    ) {
      return false;
    }

    return true;
  }

  async findOneByCedula(tipoDocumento: string, numeroIdentificacion: string) {
    const estudiante = await this.prisma.estudiante.findFirst({
      where: {
        numeroIdentificacion,
        tipoDocumento: tipoDocumento as any,
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
    if (!estudiante) {
      return null;
    }

    // Flags de estado de fases
    const registroFichaEstudiantilCompletado = this.verificarRegistroCompleto(estudiante);
    // Por ahora, la lógica exacta de Fase Socioeconómica (pasos 8-12) no está totalmente definida en backend,
    // así que se deja en false hasta que negocio/academia definan los campos críticos.
    const registroFichaSocioeconomicaCompletado = false;
    const registroDatosFacturacionCompletado = this.esFacturacionCompleta(estudiante);

    // Agregar los flags de estado a la respuesta
    return {
      ...estudiante,
      registroFichaEstudiantilCompletado,
      registroFichaSocioeconomicaCompletado,
      registroDatosFacturacionCompletado,
    };
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

      // Manejar formato especial de estructuraVivienda: "OTRO: [especificación]"
      if (data.estructuraVivienda && typeof data.estructuraVivienda === 'string' && data.estructuraVivienda.startsWith('OTRO: ')) {
        const especificacion = data.estructuraVivienda.substring(7); // Remover "OTRO: "
        data.estructuraVivienda = 'OTRO';
        // Si no viene estructuraViviendaEspecifique, usar la especificación extraída
        if (!data.estructuraViviendaEspecifique || data.estructuraViviendaEspecifique === '') {
          data.estructuraViviendaEspecifique = especificacion;
        }
      }

      // Normalizar campos de características de vivienda
      // Convertir strings vacíos a "NA" (excepto estructuraViviendaEspecifique que puede ser null)
      const viviendaStringFields = [
        'tipoPropiedadVivienda',
        'estructuraVivienda',
        'tipoVivienda',
        'comparteHabitacion',
        'conQuienVive',
        'tamanoViviendaSuficiente'
      ];

      viviendaStringFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
          // Si viene como string vacío, convertir a "NA"
          if (data[field] === '') {
            data[field] = 'NA';
          }
        } else if (data[field] === undefined) {
          // Si no viene, usar "NA" como default
          data[field] = 'NA';
        }
      });

      // Manejar estructuraViviendaEspecifique (puede ser null o string vacío)
      if (data.estructuraViviendaEspecifique !== undefined) {
        if (data.estructuraViviendaEspecifique === '') {
          data.estructuraViviendaEspecifique = null;
        }
      } else {
        data.estructuraViviendaEspecifique = null;
      }

      // Manejar campos numéricos: si vienen como undefined, no incluirlos (Prisma usará null)
      if (data.cantidadBanos === undefined) {
        delete data.cantidadBanos;
      }
      if (data.cantidadHabitaciones === undefined) {
        delete data.cantidadHabitaciones;
      }

      // Normalizar campos de financiamiento
      // Campos booleanos: si vienen como undefined, establecer false como default
      const financiamientoBooleanFields = [
        'financiamientoFondosPropios',
        'financiamientoAyudaPadres',
        'financiamientoTarjetaCredito',
        'financiamientoEntidadFinanciera',
        'financiamientoTercerasPersonas'
      ];

      financiamientoBooleanFields.forEach(field => {
        if (data[field] === undefined) {
          data[field] = false;
        }
        // Asegurar que sea boolean (por si viene como string "true"/"false")
        if (typeof data[field] === 'string') {
          data[field] = data[field] === 'true';
        }
      });

      // Normalizar financiamientoQuienes: string vacío → "NA"
      if (data.financiamientoQuienes !== undefined && data.financiamientoQuienes !== null) {
        if (data.financiamientoQuienes === '') {
          data.financiamientoQuienes = 'NA';
        }
      } else if (data.financiamientoQuienes === undefined) {
        data.financiamientoQuienes = 'NA';
      }

      // Normalizar copiaCedula y copiaPapeleta: string vacío → "NA"
      if (data.copiaCedula !== undefined && data.copiaCedula !== null) {
        if (data.copiaCedula === '') {
          data.copiaCedula = 'NA';
        }
      } else if (data.copiaCedula === undefined) {
        data.copiaCedula = 'NA';
      }

      if (data.copiaPapeleta !== undefined && data.copiaPapeleta !== null) {
        if (data.copiaPapeleta === '') {
          data.copiaPapeleta = 'NA';
        }
      } else if (data.copiaPapeleta === undefined) {
        data.copiaPapeleta = 'NA';
      }

      // Normalizar certificadoRegistroTitulo: string vacío → "NA"
      if (data.certificadoRegistroTitulo !== undefined && data.certificadoRegistroTitulo !== null) {
        if (data.certificadoRegistroTitulo === '') {
          data.certificadoRegistroTitulo = 'NA';
        }
      } else if (data.certificadoRegistroTitulo === undefined) {
        data.certificadoRegistroTitulo = 'NA';
      }

      // Normalizar tipoColegioId: si viene vacío o undefined, dejarlo como null (para colegios nuevos)
      if (data.tipoColegioId !== undefined) {
        if (data.tipoColegioId === '' || data.tipoColegioId === null) {
          data.tipoColegioId = null;
        }
      }
      // Si no viene, no hacer nada (mantener el valor existente o null si es nuevo)

      // Normalizar alergias: si presentaAlergiaImportante !== 'SI', entonces alergias debe ser 'NA'
      if (data.presentaAlergiaImportante !== undefined && data.presentaAlergiaImportante !== 'SI') {
        if (data.alergias !== undefined && data.alergias !== null && data.alergias !== '' && data.alergias !== 'NA') {
          // Si viene con un valor diferente a 'NA' o vacío, normalizar a 'NA'
          data.alergias = 'NA';
        } else if (data.alergias === undefined || data.alergias === null || data.alergias === '') {
          data.alergias = 'NA';
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

