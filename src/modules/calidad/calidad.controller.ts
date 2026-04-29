import { Controller, Get } from '@nestjs/common';
import { CalidadService } from './calidad.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Marco Normativo y Calidad')
@Controller('calidad')
export class CalidadController {
  constructor(private readonly service: CalidadService) {}

  @Get('normativas')
  findAllNormativas() {
    return this.service.findAllNormativas();
  }

  @Get('indicadores')
  findAllIndicadores() {
    return this.service.findAllIndicadores();
  }
}
