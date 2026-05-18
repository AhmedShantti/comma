import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('addons')
export class Addon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name_ar: string;

  @Column()
  name_en: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
