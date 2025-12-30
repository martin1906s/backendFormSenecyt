-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CEDULA', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('HOMBRE', 'MUJER');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTERO', 'CASADO', 'DIVORCIADO', 'UNION_LIBRE', 'VIUDO');

-- CreateEnum
CREATE TYPE "Etnia" AS ENUM ('INDÍGENA', 'AFROECUATORIANO', 'NEGRO', 'MULATO', 'MONTUVIO', 'MESTIZO', 'BLANCO', 'OTRO', 'NO_REGISTRA');

-- CreateEnum
CREATE TYPE "TipoSangre" AS ENUM ('A_POSITIVO', 'A_NEGATIVO', 'B_POSITIVO', 'B_NEGATIVO', 'AB_POSITIVO', 'AB_NEGATIVO', 'O_POSITIVO', 'O_NEGATIVO', 'NO_REGISTRA');

-- CreateEnum
CREATE TYPE "Discapacidad" AS ENUM ('SI', 'NO');

-- CreateEnum
CREATE TYPE "TipoDiscapacidad" AS ENUM ('FISICA', 'INTELECTUAL', 'AUDITIVA', 'VISUAL', 'PSICOSOCIAL', 'MULTIPLE', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "TipoColegio" AS ENUM ('FISCAL', 'FISCOMISIONAL', 'PARTICULAR', 'MUNICIPAL', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "ModalidadCarrera" AS ENUM ('PRESENCIAL', 'SEMIPRESENCIAL', 'A_DISTANCIA', 'DUAL', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "JornadaCarrera" AS ENUM ('MATUTINA', 'VESPERTINA', 'NOCTURNA', 'FIN_DE_SEMANA', 'MIXTA', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "TipoMatricula" AS ENUM ('ORDINARIA', 'EXTRAORDINARIA', 'ESPECIAL');

-- CreateEnum
CREATE TYPE "NivelAcademico" AS ENUM ('PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO');

-- CreateEnum
CREATE TYPE "HaRepetidoAlMenosUnaMateria" AS ENUM ('SI', 'NO');

-- CreateEnum
CREATE TYPE "HaPerdidoLaGratuidad" AS ENUM ('SI', 'NO', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "Paralelo" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T');

-- CreateEnum
CREATE TYPE "RecibePensionDiferenciada" AS ENUM ('SI', 'NO', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "EstudianteOcupacion" AS ENUM ('SOLO_ESTUDIA', 'TRABAJA_Y_ESTUDIA');

-- CreateEnum
CREATE TYPE "IngresosEstudiante" AS ENUM ('FINANCIAR_ESTUDIOS', 'MANTENER_HOGAR', 'GASTOS_PERSONALES', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "BonoDesarrollo" AS ENUM ('SI', 'NO');

-- CreateEnum
CREATE TYPE "HaRealizadoPracticasPreprofesionales" AS ENUM ('SI', 'NO');

-- CreateEnum
CREATE TYPE "EntornoInstitucionalPracticasProfesionales" AS ENUM ('PUBLICA', 'PRIVADA', 'ONG', 'OTRO', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "SectorEconomicoPracticaProfesional" AS ENUM ('AGRICULTURA_GANADERIA', 'MINERIA', 'MANUFACTURA', 'CONSTRUCCION', 'COMERCIO', 'TRANSPORTE', 'ALOJAMIENTO_RESTAURANTES', 'INFORMACION_COMUNICACION', 'FINANCIERO_SEGUROS', 'INMOBILIARIA', 'PROFESIONAL_CIENTIFICO', 'ADMINISTRACION_SOPORTE', 'ADMINISTRACION_PUBLICA', 'EDUCACION', 'SALUD', 'ARTES_ENTRETENIMIENTO', 'OTROS_SERVICIOS', 'HOGARES_PRIVADOS', 'ORGANIZACIONES_INTERNACIONALES', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "TipoBeca" AS ENUM ('TOTAL', 'PARCIAL', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "PrimeraRazonBeca" AS ENUM ('SOCIOECONOMICA', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "SegundaRazonBeca" AS ENUM ('EXCELENCIA_ACADEMICA', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "TerceraRazonBeca" AS ENUM ('DEPORTISTA', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "CuartaRazonBeca" AS ENUM ('PUEBLOS_Y_NACIONALIDADES', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "QuintaRazonBeca" AS ENUM ('DISCAPACIDAD', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "SextaRazonBeca" AS ENUM ('OTRA', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "FinanciamientoBeca" AS ENUM ('FONDOS_PROPIOS', 'TRANFERENCIA_DEL_ESTADO', 'DONACIONES', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "ParticipaEnProyectoVinculacionSociedad" AS ENUM ('SI', 'NO', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "TipoAlcanceProyectoVinculacion" AS ENUM ('NACIONAL', 'PROVINCIAL', 'CANTONAL', 'PARROQUIAL', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "NivelFormacionPadre" AS ENUM ('CENTRO_ALFABETIZACION', 'JARDIN_INFANTES', 'PRIMARIA', 'EDUCACION_BASICA', 'SECUNDARIA', 'EDUCACION_MEDIA', 'SUPERIOR_NO_UNIVERSITARIA', 'SUPERIOR_UNIVERSITARIA', 'POSTGRADO', 'NO_APLICA');

-- CreateEnum
CREATE TYPE "NivelFormacionMadre" AS ENUM ('CENTRO_ALFABETIZACION', 'JARDIN_INFANTES', 'PRIMARIA', 'EDUCACION_BASICA', 'SECUNDARIA', 'EDUCACION_MEDIA', 'SUPERIOR_NO_UNIVERSITARIA', 'SUPERIOR_UNIVERSITARIA', 'POSTGRADO', 'NO_APLICA');

-- CreateTable
CREATE TABLE "PeriodoAcademico" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "PeriodoAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id" SERIAL NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "numeroIdentificacion" TEXT NOT NULL,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT NOT NULL DEFAULT 'NA',
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT NOT NULL DEFAULT 'NA',
    "sexo" "Sexo" NOT NULL,
    "genero" "Genero" NOT NULL,
    "estadoCivil" "EstadoCivil" NOT NULL,
    "etnia" "Etnia" NOT NULL,
    "puebloNacionalidadId" TEXT NOT NULL DEFAULT 'NA',
    "tipoSangre" "TipoSangre" NOT NULL,
    "discapacidad" "Discapacidad" NOT NULL,
    "porcentajeDiscapacidad" TEXT NOT NULL DEFAULT 'NA',
    "numCarnetConadis" TEXT NOT NULL DEFAULT 'NA',
    "tipoDiscapacidad" "TipoDiscapacidad" NOT NULL,
    "fechaNacimiento" TEXT NOT NULL,
    "paisNacionalidadId" TEXT NOT NULL,
    "provinciaNacimientoId" TEXT NOT NULL DEFAULT 'NA',
    "cantonNacimientoId" TEXT NOT NULL,
    "paisResidenciaId" TEXT NOT NULL,
    "provinciaResidenciaId" TEXT NOT NULL DEFAULT 'NA',
    "cantonResidenciaId" TEXT NOT NULL DEFAULT 'NA',
    "tipoColegioId" "TipoColegio" NOT NULL,
    "modalidadCarrera" "ModalidadCarrera" NOT NULL,
    "jornadaCarrera" "JornadaCarrera" NOT NULL,
    "fechaInicioCarrera" TEXT NOT NULL,
    "fechaMatricula" TEXT NOT NULL,
    "tipoMatricula" "TipoMatricula" NOT NULL,
    "nivelAcademico" "NivelAcademico" NOT NULL,
    "duracionPeriodoAcademico" INTEGER NOT NULL,
    "haRepetidoAlMenosUnaMateria" "HaRepetidoAlMenosUnaMateria" NOT NULL,
    "paralelo" "Paralelo" NOT NULL,
    "haPerdidoLaGratuidad" "HaPerdidoLaGratuidad" NOT NULL,
    "recibePensionDiferenciada" "RecibePensionDiferenciada" NOT NULL,
    "estudianteOcupacion" "EstudianteOcupacion" NOT NULL,
    "ingresosEstudiante" "IngresosEstudiante" NOT NULL,
    "bonoDesarrollo" "BonoDesarrollo" NOT NULL,
    "haRealizadoPracticasPreprofesionales" "HaRealizadoPracticasPreprofesionales" NOT NULL,
    "nroHorasPracticasPreprofesionalesPorPeriodo" TEXT NOT NULL DEFAULT 'NA',
    "entornoInstitucionalPracticasProfesionales" "EntornoInstitucionalPracticasProfesionales" NOT NULL,
    "sectorEconomicoPracticaProfesional" "SectorEconomicoPracticaProfesional" NOT NULL,
    "tipoBeca" "TipoBeca" NOT NULL,
    "primeraRazonBeca" "PrimeraRazonBeca" NOT NULL,
    "segundaRazonBeca" "SegundaRazonBeca" NOT NULL,
    "terceraRazonBeca" "TerceraRazonBeca" NOT NULL,
    "cuartaRazonBeca" "CuartaRazonBeca" NOT NULL,
    "quintaRazonBeca" "QuintaRazonBeca" NOT NULL,
    "sextaRazonBeca" "SextaRazonBeca" NOT NULL,
    "montoBeca" TEXT NOT NULL DEFAULT 'NA',
    "porcentajeBecaCoberturaArancel" TEXT NOT NULL DEFAULT 'NA',
    "porcentajeBecaCoberturaManutencion" TEXT NOT NULL DEFAULT 'NA',
    "financiamientoBeca" "FinanciamientoBeca",
    "montoAyudaEconomica" TEXT NOT NULL DEFAULT 'NA',
    "montoCreditoEducativo" TEXT NOT NULL DEFAULT 'NA',
    "participaEnProyectoVinculacionSociedad" "ParticipaEnProyectoVinculacionSociedad" NOT NULL,
    "tipoAlcanceProyectoVinculacion" "TipoAlcanceProyectoVinculacion",
    "correoElectronico" TEXT NOT NULL DEFAULT 'NA',
    "numeroCelular" TEXT NOT NULL,
    "nivelFormacionPadre" "NivelFormacionPadre" NOT NULL,
    "nivelFormacionMadre" "NivelFormacionMadre" NOT NULL,
    "ingresoTotalHogar" TEXT NOT NULL DEFAULT 'NA',
    "cantidadMiembrosHogar" INTEGER NOT NULL,
    "periodoAcademicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_numeroIdentificacion_tipoDocumento_key" ON "Estudiante"("numeroIdentificacion", "tipoDocumento");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_periodoAcademicoId_fkey" FOREIGN KEY ("periodoAcademicoId") REFERENCES "PeriodoAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
