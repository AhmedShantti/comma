import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Addon } from '../../addons/entities/addon.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  @Column()
  name_ar: string;

  @Column()
  name_en: string;

  @Column({ nullable: true })
  description_ar: string;

  @Column({ nullable: true })
  description_en: string;

  @Column('decimal', { precision: 10, scale: 2 })
  base_price: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 'standard' })
  tax_group: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @OneToMany(() => Variant, v => v.menuItem, { cascade: true })
  variants: Variant[];

  @ManyToMany(() => Addon, { cascade: true })
  @JoinTable({
    name: 'menu_item_addons',
    joinColumn: { name: 'menu_item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'addon_id', referencedColumnName: 'id' },
  })
  addons: Addon[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column()
  menu_item_id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price_adjustment: number;

  @Column({ default: true })
  is_active: boolean;
}
