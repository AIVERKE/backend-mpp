import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Operacion } from '../../flujo/entities/operacion.entity';

@Entity('Requisitos')
export class Requisitos {
  @PrimaryGeneratedColumn()
  id_requisitos: number;

  @Column({ name: 'id_operacion' })
  id_operacion: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  tipo_entrada: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;
}
