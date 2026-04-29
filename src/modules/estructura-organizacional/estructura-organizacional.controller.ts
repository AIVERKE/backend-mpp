import { Controller, Get } from '@nestjs/common';
import { EstructuraOrganizacionalService } from './estructura-organizacional.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estructura Organizacional')
@Controller('estructura-organizacional')
export class EstructuraOrganizacionalController {
  constructor(private readonly service: EstructuraOrganizacionalService) {}

  @Get('unidades')
  findAllUnidades() {
    return this.service.findAllUnidades();
  }

  @Get('cargos')
  findAllCargos() {
    return this.service.findAllCargos();
  }
}
