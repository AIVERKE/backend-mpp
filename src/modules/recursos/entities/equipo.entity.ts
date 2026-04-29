import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Procedimiento } from '../../procesos/entities/procedimiento.entity';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id_equipos: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToMany(() => Procedimiento)
  @JoinTable({
    name: 'equipos_procedimientos',
    joinColumn: { name: 'id_equipo', referencedColumnName: 'id_equipos' },
    inverseJoinColumn: {
      name: 'id_procedimiento',
      referencedColumnName: 'id_procedimiento',
    },
  })
  procedimientos: Procedimiento[];
}
