import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class SupabaseStorageService {
  private supabase: SupabaseClient;
  private bucketName: string = process.env.SUPABASE_BUCKET_NAME || 'trivias-bucket-images';
  private folderName: string = 'direcciones-domiciliarias';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mmzmuldolhpgmkwaawgc.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseKey) {
      throw new Error('SUPABASE_SERVICE_KEY o SUPABASE_ANON_KEY debe estar configurado en las variables de entorno');
    }

    console.log('Configurando Supabase Storage:');
    console.log('URL:', supabaseUrl);
    console.log('Key (primeros 20 chars):', supabaseKey.substring(0, 20) + '...');

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return this.uploadToBucket(file, this.bucketName, this.folderName);
  }

  /**
   * Sube un archivo a un bucket específico de Supabase.
   * @param file Archivo Multer
   * @param bucket Nombre del bucket (ej: 'titulo' para título de bachiller)
   * @param folder Carpeta dentro del bucket (opcional, default 'documentos')
   */
  async uploadToBucket(
    file: Express.Multer.File,
    bucket: string,
    folder: string = 'documentos',
  ): Promise<string> {
    try {
      const fileExt = extname(file.originalname);
      const fileName = `${randomUUID()}${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      let fileBuffer: Buffer;
      if (file.buffer) {
        fileBuffer = file.buffer;
      } else if (file.path) {
        fileBuffer = readFileSync(file.path);
      } else {
        throw new Error('No se pudo obtener el contenido del archivo');
      }

      console.log(`Subiendo archivo a bucket: ${bucket}, ruta: ${filePath}`);
      const { error } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Error detallado de Supabase:', error);
        if (error.message.includes('signature verification failed') || error.message.includes('JWT')) {
          throw new Error(
            `Error de autenticación con Supabase. Verifica SUPABASE_SERVICE_KEY y que el bucket '${bucket}' exista.`,
          );
        }
        if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
          throw new Error(
            `El bucket '${bucket}' no existe. Créalo en Supabase Storage (Public bucket).`,
          );
        }
        throw new Error(`Error al subir archivo: ${error.message}`);
      }

      const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(filePath);
      if (!urlData?.publicUrl) {
        throw new Error('No se pudo obtener la URL pública del archivo');
      }
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error en SupabaseStorageService.uploadToBucket:', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo del storage a partir de su URL pública.
   * La URL debe ser del tipo: .../storage/v1/object/public/{bucket}/{path}
   */
  async deleteByPublicUrl(publicUrl: string): Promise<void> {
    try {
      const supabaseUrl = process.env.SUPABASE_URL || 'https://mmzmuldolhpgmkwaawgc.supabase.co';
      const prefix = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/`;
      if (!publicUrl.startsWith(prefix)) {
        throw new Error('URL no corresponde a un archivo de este almacenamiento');
      }
      const relative = publicUrl.slice(prefix.length);
      const firstSlash = relative.indexOf('/');
      if (firstSlash === -1) {
        throw new Error('URL de archivo inválida');
      }
      const bucket = relative.slice(0, firstSlash);
      const path = relative.slice(firstSlash + 1);
      const { error } = await this.supabase.storage.from(bucket).remove([path]);
      if (error) {
        console.error('Error al eliminar de Supabase:', error);
        throw new Error(`Error al eliminar archivo: ${error.message}`);
      }
    } catch (error) {
      console.error('Error en SupabaseStorageService.deleteByPublicUrl:', error);
      throw error;
    }
  }
}
