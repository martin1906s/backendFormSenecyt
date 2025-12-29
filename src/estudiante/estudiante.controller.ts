import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
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
  constructor(private readonly estudianteService: EstudianteService) {
    // Asegurar que la carpeta uploads existe
    const uploadsDir = './uploads';
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('imagenDireccionDomiciliaria', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `direccion-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
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
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        createEstudianteDto.imagenDireccionDomiciliaria = `/uploads/${file.filename}`;
      }
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
}
