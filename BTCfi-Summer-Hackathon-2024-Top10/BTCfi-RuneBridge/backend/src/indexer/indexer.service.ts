import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IndexerService {
  private readonly _UnisatBaseUrl = `https://open-api.unisat.io/v1`;
  constructor(
    private readonly _httpService: HttpService,
    private readonly _configService: ConfigService,
  ) {}

  async getRuneBalanceByAddress(address: string) {
    const apiKey = this._configService.get(`UNISAT_API_KEY`);
    const url = `${this._UnisatBaseUrl}/indexer/address/${address}/runes/balance-list`;
    const { data } = await this._httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .toPromise();
    return data.data.detail ?? [];
  }

  async getRune(runeId: string) {
    const apiKey = this._configService.get(`UNISAT_API_KEY`);
    const url = `${this._UnisatBaseUrl}/indexer/runes/${runeId}/info`;
    const { data } = await this._httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .toPromise();
    return data.data;
  }

  async getRuneByUtxo(transactionId: string, vout: number) {
    const apiKey = this._configService.get(`UNISAT_API_KEY`);
    const url = `${this._UnisatBaseUrl}/indexer/runes/utxo/${transactionId}/${vout}/balance`;
    const { data } = await this._httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .toPromise();
    return data.data || [];
  }

  async getUTXOsFromMempool() {
    const { data } = await this._httpService
      .get(
        `https://mempool.space/api/address/bc1q2fh4s7p5r8qgmm7f430dzyrravd8hgh5atjtfk/utxo`,
      )
      .toPromise();
    return data;
  }
}
