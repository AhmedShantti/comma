import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appearance_settings')
export class AppearanceSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ default: '#c9a84c' })
  primary_color: string;

  @Column({ nullable: true })
  secondary_color: string;

  @Column({ default: false })
  dark_mode_enabled: boolean;

  @Column({ default: 'Inter' })
  font_family: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  favicon_url: string;

  @Column({ type: 'text', nullable: true })
  invoice_header_text: string;

  @Column({ type: 'text', nullable: true })
  invoice_footer_text: string;

  @Column({ type: 'text', nullable: true })
  receipt_header_text: string;

  @Column({ type: 'text', nullable: true })
  receipt_footer_text: string;

  @Column({ default: 'modern' })
  theme_preset: 'modern' | 'elegant' | 'minimal' | 'casual';

  @Column({ type: 'text', nullable: true })
  custom_css: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
