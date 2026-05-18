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

  @CreateDateColumn()
  opened_at: Date;

  @Column({ nullable: true })
  closed_at: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
