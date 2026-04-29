import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Normativa } from './entities/normativa.entity';
import { Indicador } from './entities/indicador.entity';

@Injectable()
export class CalidadService {
  constructor(
    @InjectRepository(Normativa)
    private readonly normativaRepository: Repository<Normativa>,
    @InjectRepository(Indicador)
    private readonly indicadorRepository: Repository<Indicador>,
  ) {}

  findAllNormativas() {
    return this.normativaRepository.find({ relations: ['procedimientos'] });
  }

  findAllIndicadores() {
    return this.indicadorRepository.find({ relations: ['procedimientos'] });
  }
}
