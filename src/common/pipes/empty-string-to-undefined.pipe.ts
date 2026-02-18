import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

/**
 * Convierte cadenas vacías a undefined de forma recursiva.
 * Así, en guardar-paso los campos no enviados o vacíos no disparan @IsNotEmpty()
 * y el backend puede crear el estudiante con defaults para el resto.
 */
@Injectable()
export class EmptyStringToUndefinedPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body' || value == null) return value;
    if (typeof value !== 'object') return value === '' ? undefined : value;
    return this.walk(value);
  }

  private walk(val: unknown): unknown {
    if (val === null || val === undefined) return val;
    if (typeof val === 'string') return val.trim() === '' ? undefined : val;
    if (Array.isArray(val)) {
      const arr = val.map((item) => this.walk(item));
      return arr;
    }
    if (typeof val === 'object') {
      const obj: Record<string, unknown> = {};
      for (const key of Object.keys(val as Record<string, unknown>)) {
        const v = this.walk((val as Record<string, unknown>)[key]);
        if (v !== undefined) obj[key] = v;
      }
      return obj;
    }
    return val;
  }
}
