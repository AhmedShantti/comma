import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('menu_settings')
export class MenuSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  restaurant_id: string;

  @Column({ default: false })
  hide_sold_out_items: boolean;

  @Column({ default: true })
  show_item_descriptions: boolean;

  @Column({ default: true })
  enable_addons: boolean;

  @Column({ default: true })
  enable_variants: boolean;

  @Column({ default: false })
  enable_allergen_warnings: boolean;

  @Column({ default: 'medium' })
  default_portion_size: 'small' | 'medium' | 'large';

  @Column({ default: true })
  show_item_images: boolean;

  @Column({ default: true })
  enable_menu_search: boolean;

  @Column({ default: 12, type: 'integer' })
  items_per_page: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
