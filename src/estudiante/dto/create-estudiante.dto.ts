import { IsString, IsInt, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
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
  @IsOptional()
  segundoApellido?: string;

  @IsString()
  @IsNotEmpty()
  primerNombre: string;

  @IsString()
  @IsOptional()
  segundoNombre?: string;

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
  puebloNacionalidadId?: string;

  @IsEnum(TipoSangre)
  @IsNotEmpty()
  tipoSangre: TipoSangre;

  @IsEnum(Discapacidad)
  @IsNotEmpty()
  discapacidad: Discapacidad;

  @IsString()
  @IsOptional()
  porcentajeDiscapacidad?: string;

  @IsString()
  @IsOptional()
  numCarnetConadis?: string;

  @IsEnum(TipoDiscapacidad)
  @IsNotEmpty()
  tipoDiscapacidad: TipoDiscapacidad;

  @IsString()
  @IsNotEmpty()
  fechaNacimiento: string;

  @IsString()
  @IsNotEmpty()
  paisNacionalidadId: string;

  @IsString()
  @IsOptional()
  provinciaNacimientoId?: string;

  @IsString()
  @IsNotEmpty()
  cantonNacimientoId: string;

  @IsString()
  @IsNotEmpty()
  paisResidenciaId: string;

  @IsString()
  @IsOptional()
  provinciaResidenciaId?: string;

  @IsString()
  @IsOptional()
  cantonResidenciaId?: string;

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

  @IsEnum(NivelAcademico)
  @IsNotEmpty()
  nivelAcademico: NivelAcademico;

  @IsInt()
  @IsNotEmpty()
  duracionPeriodoAcademico: number;

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
  @IsOptional()
  nroHorasPracticasPreprofesionalesPorPeriodo?: string;

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
  @IsOptional()
  montoBeca?: string;

  @IsString()
  @IsOptional()
  porcentajeBecaCoberturaArancel?: string;

  @IsString()
  @IsOptional()
  porcentajeBecaCoberturaManutencion?: string;

  @IsEnum(FinanciamientoBeca)
  @IsOptional()
  financiamientoBeca?: FinanciamientoBeca;

  @IsString()
  @IsOptional()
  montoAyudaEconomica?: string;

  @IsString()
  @IsOptional()
  montoCreditoEducativo?: string;

  @IsEnum(ParticipaEnProyectoVinculacionSociedad)
  @IsNotEmpty()
  participaEnProyectoVinculacionSociedad: ParticipaEnProyectoVinculacionSociedad;

  @IsEnum(TipoAlcanceProyectoVinculacion)
  @IsOptional()
  tipoAlcanceProyectoVinculacion?: TipoAlcanceProyectoVinculacion;

  @IsString()
  @IsOptional()
  correoElectronico?: string;

  @IsString()
  @IsNotEmpty()
  numeroCelular: string;

  @IsEnum(NivelFormacionPadre)
  @IsNotEmpty()
  nivelFormacionPadre: NivelFormacionPadre;

  @IsEnum(NivelFormacionMadre)
  @IsNotEmpty()
  nivelFormacionMadre: NivelFormacionMadre;

  @IsString()
  @IsOptional()
  ingresoTotalHogar?: string;

  @IsInt()
  @IsNotEmpty()
  cantidadMiembrosHogar: number;

  @IsInt()
  @IsNotEmpty()
  periodoAcademicoId: number;
}

