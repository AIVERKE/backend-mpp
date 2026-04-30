import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Proceso } from './entities/proceso.entity';
import { Procedimiento } from './entities/procedimiento.entity';
import { CargoProceso } from './entities/cargo-proceso.entity';
import { CreateProcesoDto, UpdateProcesoDto } from './dto/proceso.dto';
import {
  CreateProcedimientoDto,
  UpdateProcedimientoDto,
} from './dto/procedimiento.dto';
import {
  CreateCargoProcesoDto,
  UpdateCargoProcesoDto,
} from './dto/cargo-proceso.dto';
import { Unidad } from '../estructura-organizacional/entities/unidad.entity';

@Injectable()
export class ProcesosService {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepository: Repository<Proceso>,
    @InjectRepository(Procedimiento)
    private readonly procedimientoRepository: Repository<Procedimiento>,
    @InjectRepository(CargoProceso)
    private readonly cargoProcesoRepository: Repository<CargoProceso>,
    @InjectRepository(Unidad)
    private readonly unidadRepository: Repository<Unidad>,
  ) {}

  // --- Procesos ---

  async createProceso(createDto: CreateProcesoDto): Promise<Proceso> {
    const { id_unidades, ...procesoData } = createDto;
    const proceso = this.procesoRepository.create(procesoData);

    if (id_unidades && id_unidades.length > 0) {
      proceso.unidades = await this.unidadRepository.findBy({
        id_unidad: In(id_unidades),
      });
    }

    return await this.procesoRepository.save(proceso);
  }

  async findAllProcesos(): Promise<Proceso[]> {
    return await this.procesoRepository.find({
      relations: ['unidades', 'cargoProcesos', 'cargoProcesos.cargo'],
    });
  }

  async findOneProceso(id: number): Promise<Proceso> {
    const proceso = await this.procesoRepository.findOne({
      where: { id_proceso: id },
      relations: ['unidades', 'cargoProcesos', 'cargoProcesos.cargo'],
    });
    if (!proceso)
      throw new NotFoundException(`Proceso con ID ${id} no encontrado`);
    return proceso;
  }

  async updateProceso(
    id: number,
    updateDto: UpdateProcesoDto,
  ): Promise<Proceso> {
    const proceso = await this.findOneProceso(id);
    const { id_unidades, ...procesoData } = updateDto;

    Object.assign(proceso, procesoData);

    if (id_unidades) {
      proceso.unidades =
        id_unidades.length > 0
          ? await this.unidadRepository.findBy({ id_unidad: In(id_unidades) })
          : [];
    }

    return await this.procesoRepository.save(proceso);
  }

  async removeProceso(id: number): Promise<void> {
    const proceso = await this.findOneProceso(id);
    await this.procesoRepository.softRemove(proceso);
  }

  // --- Procedimientos ---

  async createProcedimiento(
    createDto: CreateProcedimientoDto,
  ): Promise<Procedimiento> {
    const { id_instalaciones, ...procedimientoData } = createDto;
    const procedimiento =
      this.procedimientoRepository.create(procedimientoData);

    if (id_instalaciones && id_instalaciones.length > 0) {
      procedimiento.instalaciones = await this.unidadRepository.findBy({
        id_unidad: In(id_instalaciones),
      });
    }

    return await this.procedimientoRepository.save(procedimiento);
  }

  async findAllProcedimientos(): Promise<Procedimiento[]> {
    return await this.procedimientoRepository.find({
      relations: ['proceso', 'instalaciones'],
    });
  }

  async findOneProcedimiento(id: number): Promise<Procedimiento> {
    const procedimiento = await this.procedimientoRepository.findOne({
      where: { id_procedimiento: id },
      relations: ['proceso', 'instalaciones'],
    });
    if (!procedimiento)
      throw new NotFoundException(`Procedimiento con ID ${id} no encontrado`);
    return procedimiento;
  }

  async updateProcedimiento(
    id: number,
    updateDto: UpdateProcedimientoDto,
  ): Promise<Procedimiento> {
    const procedimiento = await this.findOneProcedimiento(id);
    const { id_instalaciones, ...procedimientoData } = updateDto;

    Object.assign(procedimiento, procedimientoData);

    if (id_instalaciones) {
      procedimiento.instalaciones =
        id_instalaciones.length > 0
          ? await this.unidadRepository.findBy({
              id_unidad: In(id_instalaciones),
            })
          : [];
    }

    return await this.procedimientoRepository.save(procedimiento);
  }

  async removeProcedimiento(id: number): Promise<void> {
    const procedimiento = await this.findOneProcedimiento(id);
    await this.procedimientoRepository.softRemove(procedimiento);
  }

  // --- CargoProcesos ---

  async createCargoProceso(
    createDto: CreateCargoProcesoDto,
  ): Promise<CargoProceso> {
    const cargoProceso = this.cargoProcesoRepository.create(createDto);
    return await this.cargoProcesoRepository.save(cargoProceso);
  }

  async findAllCargoProcesos(): Promise<CargoProceso[]> {
    return await this.cargoProcesoRepository.find({
      relations: ['cargo', 'proceso'],
    });
  }

  async findOneCargoProceso(id: number): Promise<CargoProceso> {
    const cargoProceso = await this.cargoProcesoRepository.findOne({
      where: { id },
      relations: ['cargo', 'proceso'],
    });
    if (!cargoProceso)
      throw new NotFoundException(
        `Relación Cargo-Proceso con ID ${id} no encontrada`,
      );
    return cargoProceso;
  }

  async updateCargoProceso(
    id: number,
    updateDto: UpdateCargoProcesoDto,
  ): Promise<CargoProceso> {
    const cargoProceso = await this.findOneCargoProceso(id);
    Object.assign(cargoProceso, updateDto);
    return await this.cargoProcesoRepository.save(cargoProceso);
  }

  async removeCargoProceso(id: number): Promise<void> {
    const cargoProceso = await this.findOneCargoProceso(id);
    await this.cargoProcesoRepository.softRemove(cargoProceso);
  }
}
