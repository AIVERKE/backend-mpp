import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MofService } from './mof.service';
import { MofController } from './mof.controller';
import { Unidad } from '../estructura-organizacional/entities/unidad.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Unidad])],
  controllers: [MofController],
  providers: [MofService],
  exports: [MofService],
})
export class MofModule {}
