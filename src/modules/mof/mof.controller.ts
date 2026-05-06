import { Controller, Get, Post, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MofService } from './mof.service';
import { MofUnidadDto } from './dto/mof-unidad.dto';

@ApiTags('mof')
@Controller('mof')
export class MofController {
  private readonly logger = new Logger(MofController.name);

  constructor(private readonly mofService: MofService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Verifica la conectividad con el API del MOF',
    description:
      'Intenta realizar una petición al servicio externo del MOF para validar que el endpoint esté activo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conectividad exitosa.',
    schema: {
      example: { status: 'OK', message: 'Conectividad con MOF establecida' },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio MOF no disponible.',
    schema: {
      example: {
        status: 'Error',
        message: 'Sin conexión con MOF: [Detalle del error]',
      },
    },
  })
  async health() {
    return await this.mofService.healthCheck();
  }

  @Get('unidades')
  @ApiOperation({
    summary: 'Lista las unidades directamente desde el MOF (sin persistir)',
    description:
      'Obtiene los datos en tiempo real desde el servicio externo sin afectar la base de datos local.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de unidades obtenida.',
    type: [MofUnidadDto],
  })
  async getUnidades() {
    return await this.mofService.fetchUnidades();
  }

  @Post('sync')
  @ApiOperation({
    summary:
      'Sincroniza manualmente los datos del MOF a la base de datos local',
    description:
      '⚠️ ADVERTENCIA: Este endpoint vacía la tabla "Unidad" (TRUNCATE CASCADE) y la repuebla con los datos más recientes del MOF.',
  })
  @ApiResponse({
    status: 201,
    description: 'Sincronización iniciada/completada.',
    schema: {
      example: {
        total: 154,
        timestamp: '2026-05-06T14:30:00Z',
        status: 'Éxito',
      },
    },
  })
  async sync() {
    return await this.mofService.sync();
  }

  @Get('status')
  @ApiOperation({
    summary: 'Muestra el estado de la última sincronización',
    description:
      'Retorna información sobre cuándo fue la última vez que se ejecutó el proceso de sincronización.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de sincronización.',
    schema: {
      example: {
        lastSync: '2026-05-06T14:30:00Z',
        status: 'Éxito',
        apiUrl: 'https://correspondencia.fcpn.edu.bo/...',
      },
    },
  })
  getStatus() {
    return this.mofService.getStatus();
  }
}
