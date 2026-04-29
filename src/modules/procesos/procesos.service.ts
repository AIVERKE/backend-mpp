import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proceso } from './entities/proceso.entity';
import { Procedimiento } from './entities/procedimiento.entity';

@Injectable()
export class ProcesosService {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepository: Repository<Proceso>,
    @InjectRepository(Procedimiento)
    private readonly procedimientoRepository: Repository<Procedimiento>,
  ) {}

  findAllProcesos() {
    return this.procesoRepository.find({ relations: ['unidades', 'cargoProcesos'] });
  }

  findAllProcedimientos() {
    return this.procedimientoRepository.find({ relations: ['proceso', 'instalaciones'] });
  }
}
