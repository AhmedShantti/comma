import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('security_settings')
export class SecuritySettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ default: false })
  ip_whitelist_enabled: boolean;

  @Column('jsonb', { default: JSON.stringify([]) })
  ip_whitelist: string[];

  @Column({ default: false })
  ip_blacklist_enabled: boolean;

  @Column('jsonb', { default: JSON.stringify([]) })
  ip_blacklist: string[];

  @Column({ default: true })
  enforce_https_only: boolean;

  @Column({ default: false })
  cors_enabled: boolean;

  @Column('jsonb', { default: JSON.stringify([]) })
  cors_origins: string[];

  @Column({ default: true })
  csrf_protection_enabled: boolean;

  @Column({ default: true })
  audit_logging_enabled: boolean;

  @Column({ default: 365, type: 'integer' })
  audit_log_retention_days: number;

  @Column({ default: false })
  data_encryption_enabled: boolean;

  @Column({ default: 90, type: 'integer' })
  require_password_reset_days: number;

  @Column({ default: 5, type: 'integer' })
  suspicious_activity_threshold: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
