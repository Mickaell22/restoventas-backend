import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../common/numeric.transformer';
import { User } from '../users/user.entity';
import { SaleItem } from './sale-item.entity';

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('numeric', { precision: 10, scale: 2, transformer: numericTransformer })
  total: number;

  @Column({ name: 'payment_method', default: 'cash' })
  paymentMethod: PaymentMethod;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SaleItem, (item) => item.sale, {
    cascade: true,
  })
  items: SaleItem[];
}
