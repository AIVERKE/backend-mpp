import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateFiguraDto {
  @ApiProperty({
    description: 'Nombre legible de la figura',
    example: 'Rectángulo',
  })
  nombre: string;

  @ApiProperty({
    description: 'Código único para el renderer del frontend',
    example: 'rectangulo',
  })
  codigo: string;
}

export class UpdateFiguraDto extends PartialType(CreateFiguraDto) {}
