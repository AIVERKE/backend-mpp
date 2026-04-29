import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Actividad } from './actividad.entity';
import { Accion } from './accion.entity';

@Entity('Tarea')
export class Tarea {
  @PrimaryGeneratedColumn()
  id_tarea: number;

  @Column({ name: 'id_actividad' })
  id_actividad: number;

  @Column({ name: 'id_accion' })
  id_accion: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ nullable: true })
  orden: number;

  @ManyToOne(() => Actividad)
  @JoinColumn({ name: 'id_actividad' })
  actividad: Actividad;

  @ManyToOne(() => Accion)
  @JoinColumn({ name: 'id_accion' })
  accion: Accion;
}
