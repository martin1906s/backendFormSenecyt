import { IsString, IsOptional } from 'class-validator';

export class CreateIngresoFamiliarDto {
  @IsString()
  @IsOptional()
  nombresApellidos?: string;

  @IsString()
  @IsOptional()
  parentesco?: string;

  @IsString()
  @IsOptional()
  actividadLaboral?: string;

  @IsString()
  @IsOptional()
  ingresoMensual?: string;

  @IsString()
  @IsOptional()
  ingresosExtras?: string;

  @IsString()
  @IsOptional()
  total?: string;
}
