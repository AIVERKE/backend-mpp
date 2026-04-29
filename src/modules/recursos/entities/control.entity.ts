import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Operacion } from '../../flujo/entities/operacion.entity';

@Entity('Control')
export class Control {
  @PrimaryGeneratedColumn()
  id_control: number;

  @Column({ name: 'id_operacion' })
  id_operacion: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  tipo_control: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;
}
