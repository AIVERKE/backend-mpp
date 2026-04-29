import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Accion')
export class Accion {
  @PrimaryGeneratedColumn()
  id_accion: number;

  @Column()
  nombre_accion: string;
}
