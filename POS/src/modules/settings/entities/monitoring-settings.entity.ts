import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('monitoring_settings')
export class MonitoringSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  restaurant_id: string;

  @Column({ default: false })
  error_tracking_enabled: boolean;

  @Column({ nullable: true })
  error_tracking_provider: string;

  @Column({ default: false })
  uptime_monitoring_enabled: boolean;

  @Column({ default: 5, type: 'integer' })
  uptime_check_interval_minutes: number;

  @Column({ default: false })
  database_performance_monitoring: boolean;

  @Column({ default: 1000, type: 'integer' })
  api_response_time_threshold_ms: number;

  @Column({ default: 10, type: 'integer' })
  alert_low_disk_space_threshold_percent: number;

  @Column({ default: 80, type: 'integer' })
  alert_high_cpu_threshold_percent: number;

  @Column('jsonb', { default: JSON.stringify([]) })
  alert_email_recipients: string[];

  @Column({ default: 30, type: 'integer' })
  performance_log_retention_days: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
