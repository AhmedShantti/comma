import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Shift } from '../../shifts/entities/shift.entity';

@Entity('cash_drawers')
export class CashDrawer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column()
  shift_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  opening_balance: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_cash_in: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_cash_out: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  expected_balance: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actual_balance: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  difference: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  opened_at: Date;

  @Column({ nullable: true })
  closed_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
