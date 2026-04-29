import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Unidad } from '../../estructura-organizacional/entities/unidad.entity';
import { CargoProceso } from './cargo-proceso.entity';

@Entity('Proceso')
export class Proceso {
  @PrimaryGeneratedColumn()
  id_proceso: number;

  @Column({ unique: true, nullable: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToMany(() => Unidad)
  @JoinTable({
    name: 'proceso_unidad',
    joinColumn: { name: 'id_proceso', referencedColumnName: 'id_proceso' },
    inverseJoinColumn: { name: 'id_unidad', referencedColumnName: 'id_unidad' },
  })
  unidades: Unidad[];

  @OneToMany(() => CargoProceso, (cargoProceso) => cargoProceso.proceso)
  cargoProcesos: CargoProceso[];
}
