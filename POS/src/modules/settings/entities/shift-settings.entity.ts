import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('shift_settings')
export class ShiftSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  restaurant_id: string;

  @Column({ default: 480, type: 'integer' })
  shift_duration_minutes: number;

  @Column({ default: false })
  allow_shift_overlap: boolean;

  @Column({ default: false })
  auto_clock_out_enabled: boolean;

  @Column({ default: 600, type: 'integer' })
  auto_clock_out_minutes: number;

  @Column({ default: 30, type: 'integer' })
  break_duration_minutes: number;

  @Column({ default: 2, type: 'integer' })
  breaks_per_shift: number;

  @Column({ default: true })
  allow_manual_clock_in_out: boolean;

  @Column({ default: false })
  warn_long_shifts: boolean;

  @Column({ default: 10, type: 'integer' })
  warn_long_shift_hours: number;

  @Column({ default: false })
  payroll_integration_enabled: boolean;

  @Column({ nullable: true })
  payroll_provider: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
