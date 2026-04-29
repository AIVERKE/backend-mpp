import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidad } from './entities/unidad.entity';
import { Cargo } from './entities/cargo.entity';

@Injectable()
export class EstructuraOrganizacionalService {
  constructor(
    @InjectRepository(Unidad)
    private readonly unidadRepository: Repository<Unidad>,
    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
  ) {}

  findAllUnidades() {
    return this.unidadRepository.find({ relations: ['cargos'] });
  }

  findAllCargos() {
    return this.cargoRepository.find();
  }
}
