import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Operacion } from './operacion.entity';
import { Cargo } from '../../estructura-organizacional/entities/cargo.entity';

@Entity('operacion_cargo')
export class OperacionCargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_operacion' })
  id_operacion: number;

  @Column({ name: 'id_cargo' })
  id_cargo: number;

  @Column({ nullable: true })
  tipo_participacion: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => Cargo)
  @JoinColumn({ name: 'id_cargo' })
  cargo: Cargo;
}
