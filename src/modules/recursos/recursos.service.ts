import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requisitos } from './entities/requisitos.entity';
import { Riesgo } from './entities/riesgo.entity';
import { Control } from './entities/control.entity';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Requisitos)
    private readonly requisitosRepository: Repository<Requisitos>,
    @InjectRepository(Riesgo)
    private readonly riesgoRepository: Repository<Riesgo>,
    @InjectRepository(Control)
    private readonly controlRepository: Repository<Control>,
  ) {}

  findAllRequisitos() {
    return this.requisitosRepository.find({ relations: ['operacion'] });
  }

  findAllRiesgos() {
    return this.riesgoRepository.find({ relations: ['operacion'] });
  }

  findAllControles() {
    return this.controlRepository.find({ relations: ['operacion'] });
  }
}
