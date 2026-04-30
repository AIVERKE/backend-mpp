import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operacion } from './entities/operacion.entity';
import { Actividad } from './entities/actividad.entity';
import { Accion } from './entities/accion.entity';
import { OperacionCargo } from './entities/operacion-cargo.entity';
import { Tarea } from './entities/tarea.entity';
import { CreateAccionDto, UpdateAccionDto } from './dto/accion.dto';
import { CreateActividadDto, UpdateActividadDto } from './dto/actividad.dto';
import { CreateOperacionDto, UpdateOperacionDto } from './dto/operacion.dto';
import {
  CreateOperacionCargoDto,
  UpdateOperacionCargoDto,
} from './dto/operacion-cargo.dto';
import { CreateTareaDto, UpdateTareaDto } from './dto/tarea.dto';

@Injectable()
export class FlujoService {
  constructor(
    @InjectRepository(Operacion)
    private readonly operacionRepository: Repository<Operacion>,
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(Accion)
    private readonly accionRepository: Repository<Accion>,
    @InjectRepository(OperacionCargo)
    private readonly operacionCargoRepository: Repository<OperacionCargo>,
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ) {}

  // --- Acciones ---

  async createAccion(createDto: CreateAccionDto): Promise<Accion> {
    const registro = this.accionRepository.create(createDto);
    return await this.accionRepository.save(registro);
  }

  async findAllAcciones(): Promise<Accion[]> {
    return await this.accionRepository.find();
  }

  async findOneAccion(id: number): Promise<Accion> {
    const registro = await this.accionRepository.findOne({
      where: { id_accion: id },
    });
    if (!registro) {
      throw new NotFoundException(`Acción con ID ${id} no encontrada`);
    }
    return registro;
  }

  async updateAccion(id: number, updateDto: UpdateAccionDto): Promise<Accion> {
    const registro = await this.findOneAccion(id);
    Object.assign(registro, updateDto);
    return await this.accionRepository.save(registro);
  }

  async removeAccion(id: number): Promise<void> {
    const registro = await this.findOneAccion(id);
    await this.accionRepository.softRemove(registro);
  }

  // --- Actividades ---

  async createActividad(createDto: CreateActividadDto): Promise<Actividad> {
    const registro = this.actividadRepository.create(createDto);
    return await this.actividadRepository.save(registro);
  }

  async findAllActividades(): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      relations: ['operacion', 'tareas'],
    });
  }

  async findOneActividad(id: number): Promise<Actividad> {
    const registro = await this.actividadRepository.findOne({
      where: { id_actividad: id },
      relations: ['operacion', 'tareas'],
    });
    if (!registro) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }
    return registro;
  }

  async updateActividad(
    id: number,
    updateDto: UpdateActividadDto,
  ): Promise<Actividad> {
    const registro = await this.findOneActividad(id);
    Object.assign(registro, updateDto);
    return await this.actividadRepository.save(registro);
  }

  async removeActividad(id: number): Promise<void> {
    const registro = await this.findOneActividad(id);
    await this.actividadRepository.softRemove(registro);
  }

  // --- Operaciones ---

  async createOperacion(createDto: CreateOperacionDto): Promise<Operacion> {
    const registro = this.operacionRepository.create(createDto);
    return await this.operacionRepository.save(registro);
  }

  async findAllOperaciones(): Promise<Operacion[]> {
    return await this.operacionRepository.find({
      relations: ['procedimiento', 'operacionCargos', 'actividades'],
    });
  }

  async findOneOperacion(id: number): Promise<Operacion> {
    const registro = await this.operacionRepository.findOne({
      where: { id_operaciones: id },
      relations: ['procedimiento', 'operacionCargos', 'actividades'],
    });
    if (!registro) {
      throw new NotFoundException(`Operación con ID ${id} no encontrada`);
    }
    return registro;
  }

  async updateOperacion(
    id: number,
    updateDto: UpdateOperacionDto,
  ): Promise<Operacion> {
    const registro = await this.findOneOperacion(id);
    Object.assign(registro, updateDto);
    return await this.operacionRepository.save(registro);
  }

  async removeOperacion(id: number): Promise<void> {
    const registro = await this.findOneOperacion(id);
    await this.operacionRepository.softRemove(registro);
  }

  // --- OperacionCargo ---

  async createOperacionCargo(
    createDto: CreateOperacionCargoDto,
  ): Promise<OperacionCargo> {
    const registro = this.operacionCargoRepository.create(createDto);
    return await this.operacionCargoRepository.save(registro);
  }

  async findAllOperacionCargos(): Promise<OperacionCargo[]> {
    return await this.operacionCargoRepository.find({
      relations: ['operacion', 'cargo'],
    });
  }

  async findOneOperacionCargo(id: number): Promise<OperacionCargo> {
    const registro = await this.operacionCargoRepository.findOne({
      where: { id },
      relations: ['operacion', 'cargo'],
    });
    if (!registro) {
      throw new NotFoundException(
        `Relación Operación-Cargo con ID ${id} no encontrada`,
      );
    }
    return registro;
  }

  async updateOperacionCargo(
    id: number,
    updateDto: UpdateOperacionCargoDto,
  ): Promise<OperacionCargo> {
    const registro = await this.findOneOperacionCargo(id);
    Object.assign(registro, updateDto);
    return await this.operacionCargoRepository.save(registro);
  }

  async removeOperacionCargo(id: number): Promise<void> {
    const registro = await this.findOneOperacionCargo(id);
    await this.operacionCargoRepository.softRemove(registro);
  }

  // --- Tareas ---

  async createTarea(createDto: CreateTareaDto): Promise<Tarea> {
    const registro = this.tareaRepository.create(createDto);
    return await this.tareaRepository.save(registro);
  }

  async findAllTareas(): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      relations: ['actividad', 'accion'],
    });
  }

  async findOneTarea(id: number): Promise<Tarea> {
    const registro = await this.tareaRepository.findOne({
      where: { id_tarea: id },
      relations: ['actividad', 'accion'],
    });
    if (!registro) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return registro;
  }

  async updateTarea(id: number, updateDto: UpdateTareaDto): Promise<Tarea> {
    const registro = await this.findOneTarea(id);
    Object.assign(registro, updateDto);
    return await this.tareaRepository.save(registro);
  }

  async removeTarea(id: number): Promise<void> {
    const registro = await this.findOneTarea(id);
    await this.tareaRepository.softRemove(registro);
  }
}
