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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
const BUCKET_TITULO = 'titulo';
const BUCKET_MAPS = 'maps';

@Controller('estudiantes')
export class EstudianteController {
  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly storage: SupabaseStorageService,
  ) {}

  @Post('upload-titulo-bachiller')
  @UseInterceptors(FileInterceptor('archivo'))
  async uploadTituloBachiller(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Debe enviar un archivo (campo: archivo)');
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Use imagen (JPEG, PNG, WebP, GIF) o PDF.',
      );
    }
    const url = await this.storage.uploadToBucket(file, BUCKET_TITULO, 'titulo');
    return { url };
  }

  @Post('delete-titulo-bachiller')
  async deleteTituloBachiller(@Body() body: { url: string }): Promise<{ ok: boolean }> {
    const url = body?.url;
    if (!url || typeof url !== 'string') {
      throw new BadRequestException('Se requiere la URL del archivo (url)');
    }
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mmzmuldolhpgmkwaawgc.supabase.co';
    const prefix = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET_TITULO}/`;
    if (!url.startsWith(prefix)) {
      throw new BadRequestException('Solo se puede eliminar un archivo del bucket título de bachiller');
    }
    await this.storage.deleteByPublicUrl(url);
    return { ok: true };
  }

  @Post('upload-croquis-vivienda')
  @UseInterceptors(FileInterceptor('archivo'))
  async uploadCroquisVivienda(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Debe enviar un archivo (campo: archivo)');
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten imágenes (JPEG, PNG, WebP, GIF).');
    }
    const url = await this.storage.uploadToBucket(file, BUCKET_MAPS, 'croquis');
    return { url };
  }

  @Post('delete-croquis-vivienda')
  async deleteCroquisVivienda(@Body() body: { url: string }): Promise<{ ok: boolean }> {
    const url = body?.url;
    if (!url || typeof url !== 'string') {
      throw new BadRequestException('Se requiere la URL del archivo (url)');
    }
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mmzmuldolhpgmkwaawgc.supabase.co';
    const prefix = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET_MAPS}/`;
    if (!url.startsWith(prefix)) {
      throw new BadRequestException('Solo se puede eliminar un archivo del bucket maps');
    }
    await this.storage.deleteByPublicUrl(url);
    return { ok: true };
  }

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

  @Post('guardar-paso')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  guardarPaso(@Body() updateEstudianteDto: UpdateEstudianteDto) {
    return this.estudianteService.guardarPaso(updateEstudianteDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudianteService.findOne(+id);
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
