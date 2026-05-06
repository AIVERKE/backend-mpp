import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Unidad } from '../estructura-organizacional/entities/unidad.entity';
import { MofUnidadDto } from './dto/mof-unidad.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MofService implements OnModuleInit {
  private readonly logger = new Logger(MofService.name);
  private readonly mofApiUrl =
    'https://correspondencia.fcpn.edu.bo/umsa-core/api/v1/mof/unidades';
  private lastSync: Date | null = null;
  private syncStatus: string = 'Nunca sincronizado';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Unidad)
    private readonly unidadRepository: Repository<Unidad>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    if (isProd) {
      this.logger.log(
        'Entorno de producción detectado. Iniciando sincronización MOF automática...',
      );
      await this.sync();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Iniciando sincronización MOF programada...');
    await this.sync();
  }

  async fetchUnidades(): Promise<MofUnidadDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ data: MofUnidadDto[] }>(this.mofApiUrl),
      );
      return response.data.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error al conectar con el MOF: ${message}`);
      throw error;
    }
  }

  async healthCheck() {
    try {
      await this.fetchUnidades();
      return { status: 'OK', message: 'Conectividad con MOF establecida' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: 'Error',
        message: `Sin conexión con MOF: ${message}`,
      };
    }
  }

  async sync() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('Obteniendo datos del MOF...');
      const mofUnidades = await this.fetchUnidades();

      this.logger.log(
        `Limpiando tabla Unidad (${mofUnidades.length} registros a insertar)...`,
      );

      // Limpieza completa con CASCADE para manejar relaciones
      await queryRunner.query(
        'TRUNCATE TABLE "Unidad" RESTART IDENTITY CASCADE',
      );

      // Inserción en batch
      const unidadesToSave = mofUnidades.map((u) => ({
        id_unidad: u.id,
        nombre: u.nombre,
        sigla: u.codigo,
        nivel: u.nivel,
        tipo_unidad: u.tipo,
      }));

      await queryRunner.manager.insert(Unidad, unidadesToSave);

      await queryRunner.commitTransaction();

      this.lastSync = new Date();
      this.syncStatus = 'Éxito';
      this.logger.log('Sincronización MOF completada exitosamente.');

      return {
        total: unidadesToSave.length,
        timestamp: this.lastSync,
        status: this.syncStatus,
      };
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      this.syncStatus = 'Error';
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Fallo en la sincronización MOF: ${message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  getStatus() {
    return {
      lastSync: this.lastSync,
      status: this.syncStatus,
      apiUrl: this.mofApiUrl,
    };
  }
}
