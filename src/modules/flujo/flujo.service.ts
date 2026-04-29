import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operacion } from './entities/operacion.entity';
import { Actividad } from './entities/actividad.entity';

@Injectable()
export class FlujoService {
  constructor(
    @InjectRepository(Operacion)
    private readonly operacionRepository: Repository<Operacion>,
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  findAllOperaciones() {
    return this.operacionRepository.find({ relations: ['procedimiento', 'operacionCargos', 'actividades'] });
  }

  findAllActividades() {
    return this.actividadRepository.find({ relations: ['operacion', 'tareas'] });
  }
}
