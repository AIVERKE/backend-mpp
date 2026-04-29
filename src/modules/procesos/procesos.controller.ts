import { Controller, Get } from '@nestjs/common';
import { ProcesosService } from './procesos.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Procesos')
@Controller('procesos')
export class ProcesosController {
  constructor(private readonly service: ProcesosService) {}

  @Get('procesos')
  findAllProcesos() {
    return this.service.findAllProcesos();
  }

  @Get('procedimientos')
  findAllProcedimientos() {
    return this.service.findAllProcedimientos();
  }
}
