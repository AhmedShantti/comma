import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  table_number: number;

  @Column({ type: 'int', default: 4 })
  capacity: number;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  @Column({ nullable: true })
  location: string; // e.g., "Window", "Corner", "Patio"

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Order, (order) => order.table, { cascade: false })
  orders: Order[];
}
