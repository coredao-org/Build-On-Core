import { Controller, Get, Param } from '@nestjs/common';
import { IndexerService } from './indexer.service';

@Controller('indexer')
export class IndexerController {
  constructor(private readonly _indexerService: IndexerService) {}

  @Get('balances/:address')
  getBalances(@Param('address') address: string) {
    return this._indexerService.getRuneBalanceByAddress(address);
  }
}
