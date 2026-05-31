import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_management_settings')
export class UserManagementSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ default: 8, type: 'integer' })
  password_min_length: number;

  @Column({ default: true })
  password_require_uppercase: boolean;

  @Column({ default: true })
  password_require_numbers: boolean;

  @Column({ default: false })
  password_require_special_chars: boolean;

  @Column({ default: 30, type: 'integer' })
  session_timeout_minutes: number;

  @Column({ default: false })
  require_2fa: boolean;

  @Column({ default: true })
  enable_email_login: boolean;

  @Column('jsonb', { default: JSON.stringify([]) })
  email_domain_restrictions: string[];

  @Column({ default: 90, type: 'integer' })
  auto_disable_inactive_users_days: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
