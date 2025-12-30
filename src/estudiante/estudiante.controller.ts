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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EstudianteService } from './estudiante.service';
import { SupabaseStorageService } from './supabase-storage.service';
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
    private readonly supabaseStorageService: SupabaseStorageService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imagenDireccionDomiciliaria', {
      storage: memoryStorage(),
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
  async create(
    @Body() createEstudianteDto: CreateEstudianteDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        // Validar tipo MIME manualmente
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException(`Tipo de archivo no permitido. Tipos permitidos: ${allowedMimeTypes.join(', ')}`);
        }
        
        // Subir la imagen a Supabase Storage y obtener la URL
        const imageUrl = await this.supabaseStorageService.uploadImage(file);
        createEstudianteDto.imagenDireccionDomiciliaria = imageUrl;
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
