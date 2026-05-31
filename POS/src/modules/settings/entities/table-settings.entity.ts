import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('table_settings')
export class TableSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ default: 10, type: 'integer' })
  default_table_count: number;

  @Column({ default: true })
  enable_qr_codes: boolean;

  @Column({ default: 'url' })
  qr_code_format: 'url' | 'text';

  @Column({ nullable: true })
  qr_prefix_url: string;

  @Column({ default: false })
  enable_table_transfer: boolean;

  @Column({ default: false })
  table_merge_enabled: boolean;

  @Column({ default: 120, type: 'integer' })
  auto_reserve_duration_minutes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
