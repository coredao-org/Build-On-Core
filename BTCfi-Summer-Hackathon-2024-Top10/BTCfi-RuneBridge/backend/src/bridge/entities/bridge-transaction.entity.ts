import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity({ name: 'bridge_transactions' })
export class BridgeTransaction extends BaseEntity {
  constructor(partial: Partial<BridgeTransaction>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  txId: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  txHash: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  status: 'confirmed' | 'pending';
}
