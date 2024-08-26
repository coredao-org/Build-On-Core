import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { BRIDGE_ABI } from './bridge.abi';
import { InjectRepository } from '@nestjs/typeorm';
import { Rune } from './entities/rune.entity';
import { Repository } from 'typeorm';
import { BridgeTransaction } from './entities/bridge-transaction.entity';

@Injectable()
export class BridgeService {
  private readonly oraclePrivateKey: string;
  private readonly ownerPrivateKey: string;
  private readonly provider: ethers.JsonRpcProvider;
  private readonly runeBridgeAddress: string;
  private readonly runeBridgeAbi: any;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Rune)
    private readonly _runeRepository: Repository<Rune>,
    @InjectRepository(BridgeTransaction)
    private readonly _bridgeTransactionRepository: Repository<BridgeTransaction>,
  ) {
    this.oraclePrivateKey =
      this.configService.get<string>('ORACLE_PRIVATE_KEY');
    this.ownerPrivateKey = this.configService.get<string>('OWNER_PRIVATE_KEY');
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('CORE_NODE_URL'),
    );
    this.runeBridgeAddress = this.configService.get<string>(
      'RUNE_BRIDGE_ADDRESS',
    );
    this.runeBridgeAbi = BRIDGE_ABI;
  }

  getRuneList() {
    return this._runeRepository.find();
  }

  async getRuneListWithContracts() {
    const res: any[] = [];
    const list = await this._runeRepository.find();
    for (const item of list) {
      const contractAddress = await this.getRuneContractById(item.identifier);
      console.log(contractAddress);
      res.push({
        contractAddress,
        ...item,
      });
    }
    return res;
  }

  async saveBridgeRequest(txHash: string, txId: string) {
    // check if txId already exists. If yes - throw error
    const existing = await this._bridgeTransactionRepository.findOne({
      where: {
        txId,
      },
    });
    if (existing) {
      throw new InternalServerErrorException('Transaction already in cache');
    }
    await this._bridgeTransactionRepository.save({
      txId,
      txHash,
      status: 'pending',
    });
  }

  async confirmBridgeRequest(txHash: string) {
    const tx = await this._bridgeTransactionRepository.findOne({
      where: {
        txHash,
      },
    });
    if (!tx) return;
    tx.status = 'confirmed';
    await this._bridgeTransactionRepository.save(tx);
  }

  async getPendingBridgeRequests() {
    return this._bridgeTransactionRepository.find({
      where: {
        status: 'pending',
      },
    });
  }

  public toEtherUnits(num: number) {
    console.log(num);
    return `${num.toFixed(0)}000000000000000000`;
  }

  private getOracleWallet() {
    return new ethers.Wallet(this.oraclePrivateKey, this.provider);
  }

  private getOwnerWallet() {
    return new ethers.Wallet(this.ownerPrivateKey, this.provider);
  }

  private getContract(wallet: ethers.Wallet) {
    return new ethers.Contract(
      this.runeBridgeAddress,
      this.runeBridgeAbi,
      wallet,
    );
  }

  getRuneDeployment(runeId: string) {
    return this._runeRepository.findOne({
      where: {
        identifier: runeId,
      },
    });
  }

  saveRuneDeployment(
    runeId: string,
    name: string,
    symbol: string,
    deploymentHash: string,
  ) {
    return this._runeRepository.save({
      identifier: runeId,
      name,
      symbol,
      deploymentHash,
    });
  }

  async deployRune(
    runeId: string,
    runeName: string,
    runeSymbol: string,
    maxSupply: string,
  ): Promise<any> {
    const ownerWallet = this.getOwnerWallet();
    const contract = this.getContract(ownerWallet);
    console.log(maxSupply);
    const tx = await contract.deployRune(
      runeId,
      runeName,
      runeSymbol,
      ethers.toBigInt(maxSupply),
    );
    return await tx.wait();
  }

  async transferRune(
    runeId: string,
    amount: number,
    destination: string,
  ): Promise<any> {
    const ownerWallet = this.getOwnerWallet();
    const contract = this.getContract(ownerWallet);
    const tx = await contract.transferRune(
      runeId,
      this.toEtherUnits(amount),
      destination,
    );
    return await tx.wait();
  }

  async getTransaction(txIdentifier: string): Promise<any> {
    const contract = new ethers.Contract(
      this.runeBridgeAddress,
      this.runeBridgeAbi,
      this.provider,
    );
    const transaction = await contract.getTransaction(txIdentifier);
    return transaction;
  }

  async setTargetTxId(txIdentifier: string, targetTxId: string): Promise<void> {
    const oracleWallet = this.getOracleWallet();
    const contract = this.getContract(oracleWallet);
    const tx = await contract.setTargetTxId(txIdentifier, targetTxId);
    await tx.wait();
  }

  async setSourceTxId(txIdentifier: string, sourceTxId: string): Promise<void> {
    const oracleWallet = this.getOracleWallet();
    const contract = this.getContract(oracleWallet);
    const tx = await contract.setSourceTxId(txIdentifier, sourceTxId);
    await tx.wait();
  }

  getRuneContractById(runeId: string): Promise<any> {
    const oracleWallet = this.getOracleWallet();
    const contract = this.getContract(oracleWallet);
    return contract.getRuneContract(runeId);
  }
}
