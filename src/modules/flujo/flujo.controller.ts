import { Controller, Get } from '@nestjs/common';
import { FlujoService } from './flujo.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Flujo de Procedimientos')
@Controller('flujo')
export class FlujoController {
  constructor(private readonly service: FlujoService) {}

  @Get('operaciones')
  findAllOperaciones() {
    return this.service.findAllOperaciones();
  }

  @Get('actividades')
  findAllActividades() {
    return this.service.findAllActividades();
  }
}
