import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { IndexerController } from './indexer.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [IndexerService],
  controllers: [IndexerController],
  exports: [IndexerService],
})
export class IndexerModule {}
