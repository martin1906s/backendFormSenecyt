import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogosService {
  constructor(private prisma: PrismaService) {}

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

  async getProvincias(paisId?: string) {
    return this.prisma.provincia.findMany({
      where: paisId ? { paisId } : undefined,
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        paisId: true,
      },
    });
  }

  async getCantones(provinciaId?: string) {
    return this.prisma.canton.findMany({
      where: provinciaId ? { provinciaId } : undefined,
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        provinciaId: true,
      },
    });
  }

  async getPueblosYNacionalidades(tipo?: 'nacionalidad' | 'pueblo') {
    let where = {};
    
    if (tipo === 'nacionalidad') {
      // Nacionalidades: códigos < 1000
      where = { codigo: { lt: 1000 } };
    } else if (tipo === 'pueblo') {
      // Pueblos: códigos >= 1000
      where = { codigo: { gte: 1000 } };
    }

    return this.prisma.puebloYNacionalidad.findMany({
      where,
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
    });
  }

  async getSectoresEconomicos() {
    return this.prisma.sectorEconomico.findMany({
      orderBy: { codigo: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
    });
  }

  async getColegios(provincia?: string, canton?: string) {
    const where: any = {};
    
    if (canton) {
      // Si se proporciona cantón, buscar por nombre de cantón
      where.Canton = {
        nombre: {
          equals: canton,
          mode: 'insensitive', // Case-insensitive
        },
      };
    } else if (provincia) {
      // Si solo se proporciona provincia, buscar por nombre de provincia
      where.Provincia = {
        nombre: {
          equals: provincia,
          mode: 'insensitive', // Case-insensitive
        },
      };
    }

    return this.prisma.colegio.findMany({
      where,
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        sostenimiento: true,
        provinciaId: true,
        cantonId: true,
        Provincia: {
          select: {
            nombre: true,
          },
        },
        Canton: {
          select: {
            nombre: true,
          },
        },
      },
    });
  }
}
