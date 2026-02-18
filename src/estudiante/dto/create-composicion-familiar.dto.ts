import { IsString, IsOptional } from 'class-validator';

export class CreateComposicionFamiliarDto {
  @IsString()
  @IsOptional()
  nombresApellidos?: string;

  @IsString()
  @IsOptional()
  fechaNacimiento?: string;

  @IsString()
  @IsOptional()
  cedulaIdentidad?: string;

  @IsString()
  @IsOptional()
  estadoCivil?: string;

  @IsString()
  @IsOptional()
  parentesco?: string;

  @IsString()
  @IsOptional()
  nivelEstudios?: string;

  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  laborOcupacion?: string;
}
