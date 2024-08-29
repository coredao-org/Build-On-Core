import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity({ name: 'runes' })
export class Rune extends BaseEntity {
  constructor(partial: Partial<Rune>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  identifier: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  symbol: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  deploymentHash: string;
}
