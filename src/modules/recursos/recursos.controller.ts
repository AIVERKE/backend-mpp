import { Controller, Get } from '@nestjs/common';
import { RecursosService } from './recursos.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Recursos, Riesgos y Controles')
@Controller('recursos')
export class RecursosController {
  constructor(private readonly service: RecursosService) {}

  @Get('requisitos')
  findAllRequisitos() {
    return this.service.findAllRequisitos();
  }

  @Get('riesgos')
  findAllRiesgos() {
    return this.service.findAllRiesgos();
  }

  @Get('controles')
  findAllControles() {
    return this.service.findAllControles();
  }
}
