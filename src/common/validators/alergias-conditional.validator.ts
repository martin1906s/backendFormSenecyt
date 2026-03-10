import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'alergiasConditional', async: false })
export class AlergiasConditionalValidator
  implements ValidatorConstraintInterface
{
  validate(
    alergias: any,
    args: ValidationArguments,
  ): boolean {
    const obj = args.object as any;
    const presentaAlergiaImportante = obj.presentaAlergiaImportante;

    // Si presentaAlergiaImportante !== 'SI', entonces alergias debe ser 'NA', vacío, null o undefined
    if (presentaAlergiaImportante !== 'SI') {
      return (
        alergias === undefined ||
        alergias === null ||
        alergias === '' ||
        alergias === 'NA'
      );
    }

    // Si presentaAlergiaImportante === 'SI', alergias puede tener cualquier valor
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Si presentaAlergiaImportante no es "SI", entonces alergias debe ser "NA" o estar vacío';
  }
}
