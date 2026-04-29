import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlujoService } from './flujo.service';
import { FlujoController } from './flujo.controller';
import { Operacion } from './entities/operacion.entity';
import { OperacionCargo } from './entities/operacion-cargo.entity';
import { Actividad } from './entities/actividad.entity';
import { Accion } from './entities/accion.entity';
import { Tarea } from './entities/tarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operacion, OperacionCargo, Actividad, Accion, Tarea])],
  controllers: [FlujoController],
  providers: [FlujoService],
  exports: [FlujoService],
})
export class FlujoModule {}
