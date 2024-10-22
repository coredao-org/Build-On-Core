import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BridgeService } from 'src/bridge/bridge.service';
import { IndexerService } from 'src/indexer/indexer.service';

@Injectable()
export class RelayerService {
  constructor(
    private readonly _indexerService: IndexerService,
    private readonly _bridgeService: BridgeService,
  ) {
    this.relayTransactions();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async relayTransactions() {
    const pendingRequests =
      await this._bridgeService.getPendingBridgeRequests();
    const utxos = await this._indexerService.getUTXOsFromMempool();
    for (const bridgeTx of pendingRequests) {
      const utxo = utxos.find((item) => item.txid == bridgeTx.txHash);
      if (utxo) {
        console.log('UTXO found!');
        console.log(`Bitcoin TX: ${utxo.txid}, VOUT: ${utxo.vout}`);
        const coreData = await this._bridgeService.getTransaction(
          bridgeTx.txId,
        );
        const bitcoinData = await this._indexerService.getRuneByUtxo(
          utxo.txid,
          utxo.vout,
        );
        const [
          cRuneId,
          cAmount,
          cSourceAddress,
          cDestination,
          cTxId,
          cTargetTxId,
          cSourceTxId,
        ] = coreData;

        const runeAmount =
          Number(bitcoinData[0].amount) / 10 ** bitcoinData[0].divisibility;
        if (runeAmount == cAmount && cRuneId == bitcoinData[0].runeid) {
          // deploy rune if not deployed already.
          const deployedRune = await this._bridgeService.getRuneDeployment(
            cRuneId,
          );
          if (!deployedRune) {
            const rune = await this._indexerService.getRune(cRuneId);
            if (!rune) {
              continue;
            } else {
              let maxSupply = 1000000000000;
              try {
                maxSupply =
                  Number(rune.terms.amount) * Number(rune.terms.cap) +
                  Number(rune.premine);
              } catch (e) {}
              console.log(rune);
              const deploymentTx = await this._bridgeService.deployRune(
                cRuneId,
                rune.spacedRune,
                rune.symbol,
                this._bridgeService.toEtherUnits(maxSupply),
              );
              await this._bridgeService.saveRuneDeployment(
                cRuneId,
                rune.spacedRune,
                rune.symbol,
                deploymentTx.hash,
              );
            }
          }
          await this._bridgeService.confirmBridgeRequest(bridgeTx.txHash);
          const transferTxId = await this._bridgeService.transferRune(
            cRuneId,
            runeAmount,
            cDestination,
          );
          await this._bridgeService.setTargetTxId(cTxId, transferTxId.hash);
          await this._bridgeService.setSourceTxId(cTxId, utxo.txid);
        }
      }
    }
  }
}
