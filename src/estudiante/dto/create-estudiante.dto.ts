import { IsString, IsInt, IsEnum, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
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
  Pais,
  Provincia,
  PuebloNacionalidad,
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

  @IsEnum(PuebloNacionalidad)
  @IsNotEmpty()
  puebloNacionalidad: PuebloNacionalidad;

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

  @IsEnum(Pais)
  @IsNotEmpty()
  paisNacionalidadId: Pais;

  @IsEnum(Provincia)
  @IsOptional()
  provinciaNacimientoId?: Provincia;

  @IsString()
  @IsNotEmpty()
  cantonNacimientoId: string;

  @IsEnum(Pais)
  @IsNotEmpty()
  paisResidenciaId: Pais;

  @IsEnum(Provincia)
  @IsNotEmpty()
  provinciaResidenciaId: Provincia;

  @IsString()
  @IsNotEmpty()
  cantonResidenciaId: string;

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
  @IsNotEmpty()
  numeroCelular: string;

  @IsEnum(NivelFormacionPadre)
  @IsNotEmpty()
  nivelFormacionPadre: NivelFormacionPadre;

  @IsEnum(NivelFormacionMadre)
  @IsNotEmpty()
  nivelFormacionMadre: NivelFormacionMadre;

  @IsString()
  @IsNotEmpty()
  ingresoTotalHogar: string;

  @IsInt()
  @IsNotEmpty()
  cantidadMiembrosHogar: number;
}

