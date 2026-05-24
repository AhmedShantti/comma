import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShiftStatus } from '../../../common/enums/shift-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  opening_cash: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  closing_cash: number;

  @Column({
    type: 'enum',
    enum: ShiftStatus,
    default: ShiftStatus.OPEN,
  })
  status: ShiftStatus;

  // ✅ Fixed: was @CreateDateColumn() which duplicated created_at
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  opened_at: Date;

  @Column({ nullable: true })
  closed_at: Date;

  @Column({ nullable: true })
  notes: string;

  // ✅ New: Order Summary (calculated when shift closes)
  @Column({ type: 'int', default: 0 })
  total_orders: number = 0;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_amount: number = 0;

  @Column({ type: 'int', default: 0 })
  total_items: number = 0;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
