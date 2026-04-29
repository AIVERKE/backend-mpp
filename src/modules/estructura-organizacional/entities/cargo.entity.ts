import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cargo')
export class Cargo {
  @PrimaryGeneratedColumn()
  id_cargo: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
