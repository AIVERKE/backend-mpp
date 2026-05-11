import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Unidad } from '../estructura-organizacional/entities/unidad.entity';
import { Cargo } from '../estructura-organizacional/entities/cargo.entity';
import { MofUnidadDto } from './dto/mof-unidad.dto';
import { MofPersonalDto } from './dto/mof-personal.dto';
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
    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
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

  async fetchPersonalByUnidad(id_unidad: number): Promise<MofPersonalDto[]> {
    const url = `https://correspondencia.fcpn.edu.bo/umsa-core/api/v1/unidades/${id_unidad}/personal`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ data: MofPersonalDto[] }>(url),
      );
      return response.data.data || [];
    } catch (error: unknown) {
      // Si es un 404, simplemente la unidad no tiene personal asignado en el MOF
      if ((error as any).response?.status === 404) {
        this.logger.warn(
          `Unidad ${id_unidad} no tiene personal registrado en el MOF (404).`,
        );
        return [];
      }

      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error al obtener personal de unidad ${id_unidad}: ${message}`,
      );
      throw error;
    }
  }

  async getCargos(): Promise<Cargo[]> {
    return await this.cargoRepository.find();
  }

  async syncCargos() {
    try {
      this.logger.log('Iniciando sincronización de cargos desde MOF...');
      const unidades = await this.unidadRepository.find();

      if (unidades.length === 0) {
        throw new Error(
          'No hay unidades sincronizadas. Sincronice unidades primero.',
        );
      }

      const cargosMap = new Map<number, Cargo>();
      const unitCargosMap = new Map<number, number[]>();

      this.logger.log(`Procesando ${unidades.length} unidades en lotes...`);

      const BATCH_SIZE = 10;
      for (let i = 0; i < unidades.length; i += BATCH_SIZE) {
        const batch = unidades.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (unidad) => {
            this.logger.log(
              `Solicitando personal para unidad ${unidad.id_unidad} (${unidad.nombre})...`,
            );
            try {
              const personal = await this.fetchPersonalByUnidad(
                unidad.id_unidad,
              );
              this.logger.log(
                `Unidad ${unidad.id_unidad} retornó ${personal.length} cargos.`,
              );
              const cargoIds: number[] = [];

              for (const p of personal) {
                if (!cargosMap.has(p.id)) {
                  cargosMap.set(p.id, {
                    id_cargo: p.id,
                    nombre: p.descripcion,
                    descripcion: p.detalle || '',
                  } as Cargo);
                }
                cargoIds.push(p.id);
              }
              unitCargosMap.set(unidad.id_unidad, cargoIds);
            } catch (error: unknown) {
              const message =
                error instanceof Error ? error.message : String(error);
              this.logger.warn(
                `Saltando unidad ${unidad.id_unidad} debido a error: ${message}`,
              );
            }
          }),
        );
        this.logger.log(
          `Progreso: ${Math.min(i + BATCH_SIZE, unidades.length)}/${unidades.length} unidades procesadas.`,
        );
        // Pequeño retraso para no saturar el API externo
        if (i + BATCH_SIZE < unidades.length) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        this.logger.log('Limpiando tabla Cargo y relaciones...');
        await queryRunner.query(
          'TRUNCATE TABLE "cargo" RESTART IDENTITY CASCADE',
        );

        this.logger.log(`Insertando ${cargosMap.size} cargos únicos...`);
        const cargosToSave = Array.from(cargosMap.values());
        if (cargosToSave.length > 0) {
          await queryRunner.manager.insert(Cargo, cargosToSave);
        }

        const relations: { id_unidad: number; id_cargo: number }[] = [];
        for (const [id_unidad, cargoIds] of unitCargosMap.entries()) {
          for (const id_cargo of cargoIds) {
            relations.push({ id_unidad, id_cargo });
          }
        }

        this.logger.log(`Total cargos únicos encontrados: ${cargosMap.size}`);
        this.logger.log(
          `Total relaciones unidad-cargo encontradas: ${relations.length}`,
        );

        if (relations.length > 0) {
          // Insertar en fragmentos de 500 para evitar límites de parámetros de SQL
          const RELATION_BATCH_SIZE = 500;
          for (let i = 0; i < relations.length; i += RELATION_BATCH_SIZE) {
            const batch = relations.slice(i, i + RELATION_BATCH_SIZE);
            const values = batch
              .map((r) => `(${r.id_unidad}, ${r.id_cargo})`)
              .join(', ');
            await queryRunner.query(
              `INSERT INTO unidad_cargos (id_unidad, id_cargo) VALUES ${values}`,
            );
          }
        }

        await queryRunner.commitTransaction();
        this.logger.log('Sincronización de cargos completada exitosamente.');

        return {
          total_cargos: cargosToSave.length,
          unidades_procesadas: unitCargosMap.size,
          timestamp: new Date(),
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Fallo en la sincronización de cargos: ${message}`);
      throw error;
    }
  }
}
