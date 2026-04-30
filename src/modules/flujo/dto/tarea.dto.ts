import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({
    description: 'ID de la actividad a la que pertenece',
    example: 1,
  })
  id_actividad: number;

  @ApiProperty({
    description: 'ID de la acción que se realiza',
    example: 1,
  })
  id_accion: number;

  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Firmar el documento de revisión',
    examples: {
      ejemplo1: { value: 'Firmar el documento de revisión' },
      ejemplo2: { value: 'Enviar notificación por correo' },
    },
  })
  descripcion: string;

  @ApiProperty({
    description: 'Orden de la tarea dentro de la actividad',
    example: 1,
    required: false,
  })
  orden?: number;
}

export class UpdateTareaDto extends PartialType(CreateTareaDto) {}
