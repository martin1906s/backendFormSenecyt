import { Controller, Get, Query } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';

@Controller()
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('paises')
  getPaises() {
    return this.catalogosService.getPaises();
  }

  @Get('provincias')
  getProvincias(@Query('paisId') paisId?: string) {
    return this.catalogosService.getProvincias(paisId);
  }

  @Get('cantones')
  getCantones(@Query('provinciaId') provinciaId?: string) {
    return this.catalogosService.getCantones(provinciaId);
  }

  @Get('pueblos-nacionalidades')
  getPueblosYNacionalidades(@Query('tipo') tipo?: 'nacionalidad' | 'pueblo') {
    return this.catalogosService.getPueblosYNacionalidades(tipo);
  }

  @Get('sectores-economicos')
  getSectoresEconomicos() {
    return this.catalogosService.getSectoresEconomicos();
  }

  @Get('colegios')
  getColegios(
    @Query('provincia') provincia?: string,
    @Query('canton') canton?: string,
  ) {
    return this.catalogosService.getColegios(provincia, canton);
  }

  @Get('seed-pueblos')
  async seedPueblos() {
    // Endpoint temporal para insertar datos de prueba
    const data = [
      // Nacionalidades (1-999)
      { codigo: 1, nombre: 'ECUATORIANA' },
      { codigo: 2, nombre: 'COLOMBIANA' },
      { codigo: 3, nombre: 'PERUANA' },
      { codigo: 4, nombre: 'VENEZOLANA' },
      { codigo: 999, nombre: 'OTRA' },
      // Pueblos (1000+)
      { codigo: 1000, nombre: 'NO_APLICA' },
      { codigo: 1001, nombre: 'KICHWA' },
      { codigo: 1002, nombre: 'SHUAR' },
      { codigo: 1003, nombre: 'ACHUAR' },
      { codigo: 1004, nombre: 'AWÁ' },
      { codigo: 1005, nombre: 'CHACHI' },
      { codigo: 1006, nombre: 'COFÁN' },
      { codigo: 1007, nombre: 'ÉPERA' },
      { codigo: 1008, nombre: 'HUAORANI' },
      { codigo: 1009, nombre: 'SARAGURO' },
      { codigo: 1010, nombre: 'TSÁCHILA' },
      { codigo: 1011, nombre: 'AFROECUATORIANO' },
      { codigo: 1012, nombre: 'MONTUBIO' },
    ];

    const results: any[] = [];
    for (const item of data) {
      try {
        const existing = await this.catalogosService['prisma'].puebloYNacionalidad.findUnique({
          where: { codigo: item.codigo }
        });
        
        if (!existing) {
          const created = await this.catalogosService['prisma'].puebloYNacionalidad.create({
            data: {
              id: require('crypto').randomUUID(),
              codigo: item.codigo,
              nombre: item.nombre,
            }
          });
          results.push({ action: 'created', ...created });
        } else {
          results.push({ action: 'exists', ...existing });
        }
      } catch (error) {
        results.push({ action: 'error', codigo: item.codigo, error: error.message });
      }
    }

    return { message: 'Seed completed', results };
  }
}
