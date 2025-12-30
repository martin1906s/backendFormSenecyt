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
    try {
      // Generar un nombre único para el archivo
      const fileExt = extname(file.originalname);
      const fileName = `${randomUUID()}${fileExt}`;
      const filePath = `${this.folderName}/${fileName}`;

      // Obtener el buffer del archivo
      let fileBuffer: Buffer;
      if (file.buffer) {
        // Si el archivo está en memoria (memoryStorage)
        fileBuffer = file.buffer;
      } else if (file.path) {
        // Si el archivo está en disco (diskStorage)
        fileBuffer = readFileSync(file.path);
      } else {
        throw new Error('No se pudo obtener el contenido del archivo');
      }

      // Subir el archivo a Supabase Storage
      console.log(`Subiendo archivo a bucket: ${this.bucketName}, ruta: ${filePath}`);
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Error detallado de Supabase:', error);
        
        // Mensaje de error más descriptivo para problemas de autenticación
        if (error.message.includes('signature verification failed') || error.message.includes('JWT')) {
          const supabaseUrl = process.env.SUPABASE_URL || 'https://mmzmuldolhpgmkwaawgc.supabase.co';
          throw new Error(
            `Error de autenticación con Supabase. Verifica que:\n` +
            `1. La URL de Supabase (${supabaseUrl}) coincida con tu proyecto\n` +
            `2. La clave SUPABASE_SERVICE_KEY sea válida y corresponda al mismo proyecto\n` +
            `3. El bucket '${this.bucketName}' exista y tenga permisos públicos`
          );
        }
        
        // Mensaje de error para bucket no encontrado
        if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
          throw new Error(
            `El bucket '${this.bucketName}' no existe en tu proyecto de Supabase.\n` +
            `Para crear el bucket:\n` +
            `1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard\n` +
            `2. Navega a Storage en el menú lateral\n` +
            `3. Haz clic en "New bucket"\n` +
            `4. Nombre del bucket: ${this.bucketName}\n` +
            `5. Marca "Public bucket" para que las imágenes sean accesibles públicamente\n` +
            `6. Haz clic en "Create bucket"\n\n` +
            `O puedes configurar un bucket diferente agregando SUPABASE_BUCKET_NAME en tu archivo .env`
          );
        }
        
        throw new Error(`Error al subir imagen a Supabase: ${error.message}`);
      }

      // Obtener la URL pública de la imagen
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('No se pudo obtener la URL pública de la imagen');
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error en SupabaseStorageService:', error);
      throw error;
    }
  }
}
