import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Cargo } from './cargo.entity';

@Entity('Unidad')
export class Unidad {
  @PrimaryGeneratedColumn()
  id_unidad: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  sigla: string;

  @Column({ nullable: true })
  nivel: string;

  @Column({ nullable: true })
  tipo_unidad: string;

  @ManyToMany(() => Cargo)
  @JoinTable({
    name: 'unidad_cargos',
    joinColumn: { name: 'id_unidad', referencedColumnName: 'id_unidad' },
    inverseJoinColumn: { name: 'id_cargo', referencedColumnName: 'id_cargo' },
  })
  cargos: Cargo[];
}
