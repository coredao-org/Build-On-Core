import { Body, Controller, Get, Post } from '@nestjs/common';
import { BridgeService } from './bridge.service';
import { CreateBridgeRequestDto } from './dto/create-bridge.request.dto';

@Controller('bridge')
export class BridgeController {
  constructor(private readonly _bridgeService: BridgeService) {}

  @Post()
  async bridge(@Body() body: CreateBridgeRequestDto) {
    await this._bridgeService.saveBridgeRequest(body.txHash, body.txId);
    return {
      success: 1,
    };
  }

  @Get('runes')
  async getRunes() {
    return this._bridgeService.getRuneList();
  }

  @Get('runes/extended')
  async getExtendedRuneInfo() {
    return this._bridgeService.getRuneListWithContracts();
  }
}
