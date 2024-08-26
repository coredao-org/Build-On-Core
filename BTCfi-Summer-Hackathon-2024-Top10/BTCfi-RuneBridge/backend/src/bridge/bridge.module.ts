import { Module } from '@nestjs/common';
import { BridgeService } from './bridge.service';
import { BridgeController } from './bridge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rune } from './entities/rune.entity';
import { BridgeTransaction } from './entities/bridge-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rune, BridgeTransaction])],
  providers: [BridgeService],
  exports: [BridgeService],
  controllers: [BridgeController],
})
export class BridgeModule {}
