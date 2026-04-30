import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateAccionDto {
  @ApiProperty({
    description: 'Nombre de la acción',
    example: 'Aprobar',
    examples: {
      ejemplo1: { value: 'Aprobar' },
      ejemplo2: { value: 'Revisar' },
    },
  })
  nombre_accion: string;
}

export class UpdateAccionDto extends PartialType(CreateAccionDto) {}
