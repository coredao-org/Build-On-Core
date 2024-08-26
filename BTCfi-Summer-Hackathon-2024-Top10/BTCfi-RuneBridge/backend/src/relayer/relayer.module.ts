import { Module } from '@nestjs/common';
import { RelayerService } from './relayer.service';
import { BridgeModule } from 'src/bridge/bridge.module';
import { IndexerModule } from 'src/indexer/indexer.module';

@Module({
  imports: [BridgeModule, IndexerModule],
  providers: [RelayerService],
})
export class RelayerModule {}
