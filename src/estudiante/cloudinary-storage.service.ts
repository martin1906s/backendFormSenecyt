import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dws7ywsvy',
      api_key: process.env.CLOUDINARY_API_KEY || '576244294667317',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'hQTB4PP0elrHJuYFlasE36FClLk',
    });
  }

  /**
   * Sube un archivo a Cloudinary en la carpeta indicada.
   * PDFs se suben como resource_type 'raw', imágenes como 'image'.
   */
  async upload(file: Express.Multer.File, folder: string = 'senecyt/documentos'): Promise<string> {
    const isPdf = file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';
    const ext = extname(file.originalname);
    const publicId = `${folder}/${randomUUID()}${ext}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          public_id: publicId,
          overwrite: false,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) return reject(new Error(`Error al subir a Cloudinary: ${error.message}`));
          if (!result?.secure_url) return reject(new Error('No se obtuvo URL de Cloudinary'));
          resolve(result.secure_url);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Elimina un archivo de Cloudinary a partir de su secure_url.
   */
  async deleteByUrl(secureUrl: string): Promise<void> {
    try {
      // Extraer public_id desde la URL
      // Formato: https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<public_id>.<ext>
      //      o:  https://res.cloudinary.com/<cloud>/raw/upload/v<ver>/<public_id>.<ext>
      const urlObj = new URL(secureUrl);
      const pathParts = urlObj.pathname.split('/');
      // pathParts: ['', '<cloud>', 'image'|'raw', 'upload', 'v<ver>', ...rest]
      const resourceType = pathParts[2] as 'image' | 'raw' | 'video';
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex === -1) throw new Error('URL de Cloudinary inválida');

      // Todo después de /upload/v<version>/ es el public_id (con extensión)
      const afterUpload = pathParts.slice(uploadIndex + 1);
      // Si el siguiente segmento empieza con 'v' seguido de números, es la versión — saltarlo
      const startIdx = /^v\d+$/.test(afterUpload[0]) ? 1 : 0;
      const publicIdWithExt = afterUpload.slice(startIdx).join('/');
      // Quitar extensión para PDFs y raw
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err: any) {
      console.error('Error al eliminar de Cloudinary:', err);
      throw new Error(`No se pudo eliminar el archivo: ${err.message}`);
    }
  }
}
