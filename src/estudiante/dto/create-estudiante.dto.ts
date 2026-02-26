import { IsString, IsInt, IsEnum, IsNotEmpty, IsOptional, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateComposicionFamiliarDto } from './create-composicion-familiar.dto';
import { CreateIngresoFamiliarDto } from './create-ingreso-familiar.dto';
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
  FinanciamientoBeca,
  ParticipaEnProyectoVinculacionSociedad,
  TipoAlcanceProyectoVinculacion,
  NivelFormacionPadre,
  NivelFormacionMadre,
} from '@prisma/client';

export class CreateEstudianteDto {
  @IsEnum(TipoDocumento)
  @IsNotEmpty()
  tipoDocumento: TipoDocumento;

  @IsString()
  @IsNotEmpty()
  numeroIdentificacion: string;

  @IsString()
  @IsNotEmpty()
  primerApellido: string;

  @IsString()
  @IsNotEmpty()
  segundoApellido: string;

  @IsString()
  @IsNotEmpty()
  primerNombre: string;

  @IsString()
  @IsNotEmpty()
  segundoNombre: string;

  @IsEnum(Sexo)
  @IsNotEmpty()
  sexo: Sexo;

  @IsEnum(Genero)
  @IsNotEmpty()
  genero: Genero;

  @IsEnum(EstadoCivil)
  @IsNotEmpty()
  estadoCivil: EstadoCivil;

  @IsEnum(Etnia)
  @IsNotEmpty()
  etnia: Etnia;

  @IsString()
  @IsOptional()
  nacionalidadId?: string;

  @IsString()
  @IsOptional()
  puebloId?: string;

  @IsEnum(TipoSangre)
  @IsNotEmpty()
  tipoSangre: TipoSangre;

  @IsEnum(Discapacidad)
  @IsNotEmpty()
  discapacidad: Discapacidad;

  @IsString()
  @IsNotEmpty()
  porcentajeDiscapacidad: string;

  @IsString()
  @IsNotEmpty()
  numCarnetConadis: string;

  @IsEnum(TipoDiscapacidad)
  @IsNotEmpty()
  tipoDiscapacidad: TipoDiscapacidad;

  @IsString()
  @IsNotEmpty()
  fechaNacimiento: string;

  @IsString()
  @IsOptional()
  paisNacionalidadId?: string;

  @IsString()
  @IsOptional()
  provinciaNacimientoId?: string;

  @IsString()
  @IsOptional()
  cantonNacimientoId?: string;

  @IsString()
  @IsOptional()
  paisResidenciaId?: string;

  @IsString()
  @IsOptional()
  provinciaResidenciaId?: string;

  @IsString()
  @IsOptional()
  cantonResidenciaId?: string;

  @IsString()
  @IsOptional()
  sectorEconomicoId?: string;

  @IsEnum(TipoColegio)
  @IsNotEmpty()
  tipoColegioId: TipoColegio;

  @IsEnum(ModalidadCarrera)
  @IsNotEmpty()
  modalidadCarrera: ModalidadCarrera;

  @IsEnum(JornadaCarrera)
  @IsNotEmpty()
  jornadaCarrera: JornadaCarrera;

  @IsString()
  @IsNotEmpty()
  fechaInicioCarrera: string;

  @IsString()
  @IsNotEmpty()
  fechaMatricula: string;

  @IsEnum(TipoMatricula)
  @IsNotEmpty()
  tipoMatricula: TipoMatricula;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = Number(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  duracionPeriodoAcademico: number;

  @IsEnum(NivelAcademico)
  @IsNotEmpty()
  nivelAcademico: NivelAcademico;

  @IsEnum(HaRepetidoAlMenosUnaMateria)
  @IsNotEmpty()
  haRepetidoAlMenosUnaMateria: HaRepetidoAlMenosUnaMateria;

  @IsEnum(Paralelo)
  @IsNotEmpty()
  paralelo: Paralelo;

  @IsEnum(HaPerdidoLaGratuidad)
  @IsNotEmpty()
  haPerdidoLaGratuidad: HaPerdidoLaGratuidad;

  @IsEnum(RecibePensionDiferenciada)
  @IsNotEmpty()
  recibePensionDiferenciada: RecibePensionDiferenciada;

  @IsEnum(EstudianteOcupacion)
  @IsNotEmpty()
  estudianteOcupacion: EstudianteOcupacion;

  @IsEnum(IngresosEstudiante)
  @IsNotEmpty()
  ingresosEstudiante: IngresosEstudiante;

  @IsEnum(BonoDesarrollo)
  @IsNotEmpty()
  bonoDesarrollo: BonoDesarrollo;

  @IsEnum(HaRealizadoPracticasPreprofesionales)
  @IsNotEmpty()
  haRealizadoPracticasPreprofesionales: HaRealizadoPracticasPreprofesionales;

  @IsString()
  @IsNotEmpty()
  nroHorasPracticasPreprofesionalesPorPeriodo: string;

  @IsEnum(EntornoInstitucionalPracticasProfesionales)
  @IsNotEmpty()
  entornoInstitucionalPracticasProfesionales: EntornoInstitucionalPracticasProfesionales;

  @IsEnum(SectorEconomicoPracticaProfesional)
  @IsNotEmpty()
  sectorEconomicoPracticaProfesional: SectorEconomicoPracticaProfesional;

  @IsEnum(TipoBeca)
  @IsNotEmpty()
  tipoBeca: TipoBeca;

  @IsEnum(PrimeraRazonBeca)
  @IsNotEmpty()
  primeraRazonBeca: PrimeraRazonBeca;

  @IsEnum(SegundaRazonBeca)
  @IsNotEmpty()
  segundaRazonBeca: SegundaRazonBeca;

  @IsEnum(TerceraRazonBeca)
  @IsNotEmpty()
  terceraRazonBeca: TerceraRazonBeca;

  @IsEnum(CuartaRazonBeca)
  @IsNotEmpty()
  cuartaRazonBeca: CuartaRazonBeca;

  @IsEnum(QuintaRazonBeca)
  @IsNotEmpty()
  quintaRazonBeca: QuintaRazonBeca;

  @IsEnum(SextaRazonBeca)
  @IsNotEmpty()
  sextaRazonBeca: SextaRazonBeca;

  @IsString()
  @IsNotEmpty()
  montoBeca: string;

  @IsString()
  @IsNotEmpty()
  porcentajeBecaCoberturaArancel: string;

  @IsString()
  @IsNotEmpty()
  porcentajeBecaCoberturaManutencion: string;

  @IsEnum(FinanciamientoBeca)
  @IsOptional()
  financiamientoBeca?: FinanciamientoBeca;

  @IsString()
  @IsNotEmpty()
  montoAyudaEconomica: string;

  @IsString()
  @IsNotEmpty()
  montoCreditoEducativo: string;

  @IsEnum(ParticipaEnProyectoVinculacionSociedad)
  @IsNotEmpty()
  participaEnProyectoVinculacionSociedad: ParticipaEnProyectoVinculacionSociedad;

  @IsEnum(TipoAlcanceProyectoVinculacion)
  @IsOptional()
  tipoAlcanceProyectoVinculacion?: TipoAlcanceProyectoVinculacion;

  @IsString()
  @IsNotEmpty()
  correoElectronico: string;

  @IsString()
  @IsOptional()
  correoInstitucional?: string;

  @IsString()
  @IsNotEmpty()
  numeroCelular: string;

  @IsString()
  @IsOptional()
  direccionDomicilio?: string;

  @IsString()
  @IsOptional()
  lugarResidencia?: string;

  @IsString()
  @IsOptional()
  carrera?: string;

  @IsString()
  @IsOptional()
  disenoCurricular?: string;

  @IsString()
  @IsOptional()
  periodoAcademico?: string;

  @IsString()
  @IsOptional()
  alergias?: string;

  @IsString()
  @IsOptional()
  medicamentos?: string;

  @IsString()
  @IsOptional()
  referenciaPersonalNombre?: string;

  @IsString()
  @IsOptional()
  referenciaPersonalParentesco?: string;

  @IsString()
  @IsOptional()
  referenciaPersonalTelefono?: string;

  @IsString()
  @IsOptional()
  enfermedadCatastrofica?: string;

  @IsEnum(NivelFormacionPadre)
  @IsNotEmpty()
  nivelFormacionPadre: NivelFormacionPadre;

  @IsEnum(NivelFormacionMadre)
  @IsNotEmpty()
  nivelFormacionMadre: NivelFormacionMadre;

  @IsString()
  @IsNotEmpty()
  ingresoTotalHogar: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = Number(value);
      return isNaN(num) ? value : Math.floor(num);
    }
    return typeof value === 'number' ? Math.floor(value) : value;
  })
  @IsInt()
  @IsNotEmpty()
  cantidadMiembrosHogar: number;

  @IsString()
  @IsOptional()
  numeroConvencional?: string;

  @IsString()
  @IsOptional()
  presentaCarnetDiscapacidad?: string;

  @IsString()
  @IsOptional()
  presentaAlergiaImportante?: string;

  @IsString()
  @IsOptional()
  nombreColegioProcedencia?: string;

  @IsString()
  @IsOptional()
  tituloBachiller?: string;

  @IsString()
  @IsOptional()
  anioGraduacion?: string;

  @IsString()
  @IsOptional()
  financiamientoQuienes?: string;

  @IsString()
  @IsOptional()
  referenciaDomiciliaria?: string;

  @IsString()
  @IsOptional()
  parroquiaResidencia?: string;

  @IsString()
  @IsOptional()
  barrioSector?: string;

  @IsString()
  @IsOptional()
  zonaVivienda?: string;

  @IsString()
  @IsOptional()
  coordenadasVivienda?: string;

  @IsString()
  @IsOptional()
  croquisViviendaUrl?: string;

  @IsString()
  @IsOptional()
  tipoPropiedadVivienda?: string;

  @IsString()
  @IsOptional()
  estructuraVivienda?: string;

  @IsString()
  @IsOptional()
  tipoVivienda?: string;

  @IsString()
  @IsOptional()
  serviciosDisponibles?: string;

  @IsOptional()
  @IsInt()
  cantidadBanos?: number;

  @IsOptional()
  @IsInt()
  cantidadHabitaciones?: number;

  @IsString()
  @IsOptional()
  comparteHabitacion?: string;

  @IsString()
  @IsOptional()
  conQuienVive?: string;

  @IsString()
  @IsOptional()
  tamanoViviendaSuficiente?: string;

  @IsString()
  @IsOptional()
  dinamicaFamiliar?: string;

  @IsString()
  @IsOptional()
  violenciaFamiliar?: string;

  @IsString()
  @IsOptional()
  tipoViolenciaFamiliar?: string;

  @IsString()
  @IsOptional()
  estudianteCabezaFamiliar?: string;

  @IsString()
  @IsOptional()
  familiaDiscapacidadEnfermedadCatastrofica?: string;

  @IsString()
  @IsOptional()
  familiaProblemaSalud?: string;

  @IsString()
  @IsOptional()
  familiaParentesco?: string;

  @IsString()
  @IsOptional()
  familiaServiciosMedicos?: string;

  @IsString()
  @IsOptional()
  familiaServiciosMedicosDetalle?: string;

  @IsString()
  @IsOptional()
  egresoVivienda?: string;

  @IsString()
  @IsOptional()
  egresoAlimentacion?: string;

  @IsString()
  @IsOptional()
  egresoEducacion?: string;

  @IsString()
  @IsOptional()
  egresoIndumentaria?: string;

  @IsString()
  @IsOptional()
  egresoTransporte?: string;

  @IsString()
  @IsOptional()
  egresoSalud?: string;

  @IsString()
  @IsOptional()
  egresoServiciosBasicos?: string;

  @IsString()
  @IsOptional()
  egresoOtros?: string;

  @IsString()
  @IsOptional()
  totalEgresos?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComposicionFamiliarDto)
  composicionFamiliar?: CreateComposicionFamiliarDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIngresoFamiliarDto)
  ingresosFamiliares?: CreateIngresoFamiliarDto[];
}

