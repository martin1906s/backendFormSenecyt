import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
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
  Pais,
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
  Provincia,
  PuebloNacionalidad,
  Canton,
} from '@prisma/client';
@Controller('estudiantes')
export class EstudianteController {
  constructor(
    private readonly estudianteService: EstudianteService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  create(
    @Body() createEstudianteDto: CreateEstudianteDto,
  ) {
    try {
      return this.estudianteService.create(createEstudianteDto);
    } catch (error) {
      console.error('Error en controller al crear estudiante:', error);
      throw error;
    }
  }

  @Get('enums')
  getEnums() {
    return {
      TipoDocumento: Object.values(TipoDocumento),
      Sexo: Object.values(Sexo),
      Genero: Object.values(Genero),
      EstadoCivil: Object.values(EstadoCivil),
      Etnia: Object.values(Etnia),
      TipoSangre: Object.values(TipoSangre),
      Discapacidad: Object.values(Discapacidad),
      TipoDiscapacidad: Object.values(TipoDiscapacidad),
      TipoColegio: Object.values(TipoColegio),
      Pais: Object.values(Pais),
      PuebloNacionalidad: Object.values(PuebloNacionalidad),
      Provincia: Object.values(Provincia),
      Canton: Object.values(Canton),
      ModalidadCarrera: Object.values(ModalidadCarrera),
      JornadaCarrera: Object.values(JornadaCarrera),
      TipoMatricula: Object.values(TipoMatricula),
      NivelAcademico: Object.values(NivelAcademico),
      HaRepetidoAlMenosUnaMateria: Object.values(HaRepetidoAlMenosUnaMateria),
      HaPerdidoLaGratuidad: Object.values(HaPerdidoLaGratuidad),
      Paralelo: Object.values(Paralelo),
      RecibePensionDiferenciada: Object.values(RecibePensionDiferenciada),
      EstudianteOcupacion: Object.values(EstudianteOcupacion),
      IngresosEstudiante: Object.values(IngresosEstudiante),
      BonoDesarrollo: Object.values(BonoDesarrollo),
      HaRealizadoPracticasPreprofesionales: Object.values(
        HaRealizadoPracticasPreprofesionales,
      ),
      EntornoInstitucionalPracticasProfesionales: Object.values(
        EntornoInstitucionalPracticasProfesionales,
      ),
      SectorEconomicoPracticaProfesional: Object.values(
        SectorEconomicoPracticaProfesional,
      ),
      TipoBeca: Object.values(TipoBeca),
      PrimeraRazonBeca: Object.values(PrimeraRazonBeca),
      SegundaRazonBeca: Object.values(SegundaRazonBeca),
      TerceraRazonBeca: Object.values(TerceraRazonBeca),
      CuartaRazonBeca: Object.values(CuartaRazonBeca),
      QuintaRazonBeca: Object.values(QuintaRazonBeca),
      SextaRazonBeca: Object.values(SextaRazonBeca),
      FinanciamientoBeca: Object.values(FinanciamientoBeca),
      ParticipaEnProyectoVinculacionSociedad: Object.values(
        ParticipaEnProyectoVinculacionSociedad,
      ),
      TipoAlcanceProyectoVinculacion: Object.values(
        TipoAlcanceProyectoVinculacion,
      ),
      NivelFormacionPadre: Object.values(NivelFormacionPadre),
      NivelFormacionMadre: Object.values(NivelFormacionMadre),
    };
  }

  @Get()
  findAll() {
    return this.estudianteService.findAll();
  }

  @Get('buscar')
  findOneByCedula(
    @Query('tipoDocumento') tipoDocumento: string,
    @Query('numeroIdentificacion') numeroIdentificacion: string,
  ) {
    return this.estudianteService.findOneByCedula(
      tipoDocumento,
      numeroIdentificacion,
    );
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudianteService.update(+id, updateEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudianteService.remove(+id);
  }
}
