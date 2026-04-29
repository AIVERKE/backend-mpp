import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Operacion } from './operacion.entity';
import { Tarea } from './tarea.entity';

@Entity('Actividad')
export class Actividad {
  @PrimaryGeneratedColumn()
  id_actividad: number;

  @Column({ name: 'id_operaciones' })
  id_operaciones: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ nullable: true })
  orden: number;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operaciones' })
  operacion: Operacion;

  @OneToMany(() => Tarea, (tarea) => tarea.actividad)
  tareas: Tarea[];
}
