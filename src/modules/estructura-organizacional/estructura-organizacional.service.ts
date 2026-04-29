import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Unidad } from './entities/unidad.entity';
import { Cargo } from './entities/cargo.entity';
import { CreateCargoDto, UpdateCargoDto } from './dto/cargo.dto';
import { CreateUnidadDto, UpdateUnidadDto } from './dto/unidad.dto';

@Injectable()
export class EstructuraOrganizacionalService {
  constructor(
    @InjectRepository(Unidad)
    private readonly unidadRepository: Repository<Unidad>,
    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
  ) {}

  // --- Cargos ---

  async createCargo(createCargoDto: CreateCargoDto): Promise<Cargo> {
    const cargo = this.cargoRepository.create(createCargoDto);
    return await this.cargoRepository.save(cargo);
  }

  async findAllCargos(): Promise<Cargo[]> {
    return await this.cargoRepository.find();
  }

  async findOneCargo(id: number): Promise<Cargo> {
    const cargo = await this.cargoRepository.findOne({
      where: { id_cargo: id },
    });
    if (!cargo) {
      throw new NotFoundException(`Cargo con ID ${id} no encontrado`);
    }
    return cargo;
  }

  async updateCargo(
    id: number,
    updateCargoDto: UpdateCargoDto,
  ): Promise<Cargo> {
    const cargo = await this.findOneCargo(id);
    Object.assign(cargo, updateCargoDto);
    return await this.cargoRepository.save(cargo);
  }

  async removeCargo(id: number): Promise<void> {
    const cargo = await this.findOneCargo(id);
    await this.cargoRepository.softRemove(cargo);
  }

  // --- Unidades ---

  async createUnidad(createUnidadDto: CreateUnidadDto): Promise<Unidad> {
    const { id_cargos, ...unidadData } = createUnidadDto;
    const unidad = this.unidadRepository.create(unidadData);

    if (id_cargos && id_cargos.length > 0) {
      unidad.cargos = await this.cargoRepository.findBy({
        id_cargo: In(id_cargos),
      });
    }

    return await this.unidadRepository.save(unidad);
  }

  async findAllUnidades(): Promise<Unidad[]> {
    return await this.unidadRepository.find({ relations: ['cargos'] });
  }

  async findOneUnidad(id: number): Promise<Unidad> {
    const unidad = await this.unidadRepository.findOne({
      where: { id_unidad: id },
      relations: ['cargos'],
    });
    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }
    return unidad;
  }

  async updateUnidad(
    id: number,
    updateUnidadDto: UpdateUnidadDto,
  ): Promise<Unidad> {
    const unidad = await this.findOneUnidad(id);
    const { id_cargos, ...unidadData } = updateUnidadDto;

    Object.assign(unidad, unidadData);

    if (id_cargos) {
      if (id_cargos.length > 0) {
        unidad.cargos = await this.cargoRepository.findBy({
          id_cargo: In(id_cargos),
        });
      } else {
        unidad.cargos = [];
      }
    }

    return await this.unidadRepository.save(unidad);
  }

  async removeUnidad(id: number): Promise<void> {
    const unidad = await this.findOneUnidad(id);
    await this.unidadRepository.softRemove(unidad);
  }
}
