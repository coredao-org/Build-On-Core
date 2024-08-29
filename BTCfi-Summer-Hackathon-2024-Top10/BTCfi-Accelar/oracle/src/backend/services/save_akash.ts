// random_address.ts

import { update, text, ic } from 'azle';
import { Bip39, Random, stringToPath, sha256 } from '@cosmjs/crypto';
import { ethers } from 'ethers';
import {
    DirectSecp256k1HdWallet,
    DirectSecp256k1Wallet,
    OfflineSigner,
    Registry,
    makeSignDoc,
    makeAuthInfoBytes,
    makeSignBytes,
    TxBodyEncodeObject,
    EncodeObject,
  } from '@cosmjs/proto-signing';
import {
    MsgCloseDeployment,
    MsgCreateDeployment,
  } from '@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg';
import {
    MsgCreateLease
  } from '@akashnetwork/akashjs/build/protobuf/akash/market/v1beta3/lease';

import { akash } from 'akashjs';
import { SDL } from '@akashnetwork/akashjs/build/sdl';
import { v2Sdl } from '@akashnetwork/akashjs/build/sdl/types';
import { NetworkId } from '@akashnetwork/akashjs/build/types/network';
import {
getAkashTypeRegistry,
getTypeUrl,
Message
} from '@akashnetwork/akashjs/build/stargate/index';
import { StargateClient, SigningStargateClient, coins, MsgSendEncodeObject } from '@cosmjs/stargate';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import axios from 'axios';
import { getAddressAkash, getEcdsaPublicKeyBase64 } from './get_address_akash';
import { waitForTransaction, yamlObj } from './deployment_akash';
const CryptoJS = require("crypto-js");
import { managementCanister } from 'azle/canisters/management';
import * as crypto from 'crypto';
import { decodeTxRaw } from "@cosmjs/proto-signing"
import { encodeLen } from "@dfinity/agent";
import { TxRaw, TxBody, Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgSend } from 'akashjs/types/proto/cosmos/bank/v1beta1/tx';
import { assert } from "@cosmjs/utils";
import { fromHex, toBase64, toHex } from "@cosmjs/encoding";

//ATTENTION: THIS SCRIPT IS MADE TO CREATE AN AKASH DEPLOYMENT, TO MAKE IT WORK, IT WAS NECESSARY TO CHANGE THE FILE AT node_modules/@akashnetwork/akashjs/build/sdl/SDL/SDL.js, SINCE 
//azle does not accept node:crypto, was installed crypto-js and used in the place of node:crypto.

const akashPubRPC = 'https://akash-rpc.publicnode.com:443';
const defaultInitialDeposit = 500000;

// Função para preparar uma mensagem de transação
export const createDeploymentAkash = update([], text, async () => {
    // const accountAddress = 'akash14hh96u4tgzp64c5hvdkxzfdzx8vphsas9d2f8p'
    const fromAddress = await getAddressAkash()
    const pubKeyEncoded = await getEcdsaPublicKeyBase64()
  
    console.log('address to use')
    console.log('connecitng client')
    console.log('client conectado')
    // const myRegistry = new Registry(getAkashTypeRegistry());
    // myRegistry.register('/akash.deployment.v1beta3.MsgCreateDeployment', MsgCreateDeployment);

    const mnemonic = 'input your mnemonic';
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: 'akash',    
    });
    const registry = new Registry();
    
    // Registra os tipos necessários no registry
    registry.register('/akash.deployment.v1beta3.MsgCreateDeployment', MsgCreateDeployment);
    // registry.register('/cosmos.tx.v1beta1.TxBody', TxBody);
    // myRegistry2.register('/cosmos.tx.v1beta1.Tx', Tx);
    
    console.log('Tipos registrados0001:', registry);
    const client2 = await StargateClient.connect(akashPubRPC);
    const client = await SigningStargateClient.connectWithSigner(
      akashPubRPC,
      wallet,
      {
        registry: registry,
      },
    );
    const currentHeight = await getCurrentHeight(client2);
    const dseq = currentHeight.toString();
    const yamlStr = YAML.parse(yamlObj);
    console.log('after yaml string')
    const deploymentData = await NewDeploymentData(
      yamlStr,
      dseq,
      fromAddress,
      defaultInitialDeposit
    );
    console.log('after deployment data')

    const createDeploymentMsg = getCreateDeploymentMsg(deploymentData);
    const value = MsgCreateDeployment.fromPartial(createDeploymentMsg.value)

    const fee = {
      amount: coins(20000, 'uakt'),
      gas: '800000',
    };
  
    // const memo = "Create deployment without signing";
    // const txBodyBytes = myRegistry.encode(createDeploymentMsg);
    // const { accountNumber, sequence } = (await client.getSequence(accountAddress))!;
    // const feeAmount = coins(20000, "uakt");
    // const gasLimit = 800000;
    // const authInfoBytes = makeAuthInfoBytes([{ pubkey, sequence }], feeAmount, gasLimit, undefined, undefined);
    // const chainId = await client.getChainId();
    // const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    // console.log('starting buffer stirngify')
    // const signBytes = makeSignBytes(signDoc)


    // console.log('starting hash')
    // // Cria o hash SHA-256 dos bytes do signDoc
    // const hash = crypto.createHash('sha256').update(signBytes).digest();

    // const signDocBytes = signDoc.bodyBytes
    // const hashToBeSigned = crypto.createHash('sha256').update(signDocBytes).digest();
  //   console.log('getting wallet')

  //   console.log('connected siggner 2')

  //   const createDeploymentMsgBytes = registry.encode({
  //     typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
  //     value: MsgCreateDeployment.fromPartial(
  //       {
  //         id: { 
  //           owner: deploymentData.deploymentId.owner,
  //           dseq,
  //         },
  //         groups: deploymentData.groups,
  //         version: deploymentData.version,
  //         deposit: deploymentData.deposit,
  //         depositor: deploymentData.depositor,
  //       },
  //     ),
  // });
  console.log('o endereceo akash')
  console.log(fromAddress)
  console.log('o pubkey encoded')
  console.log(pubKeyEncoded)
  const newBodyBytes = registry.encode({
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: {
      messages: [
        {
          typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
          value: createDeploymentMsg.value,
        },
      ],
    },
  } as EncodeObject);

    // const txBody = TxBody.fromPartial({
    //   messages: [{
    //     typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
    //     value: createDeploymentMsgBytes
    //   }],
    //   memo: "", // Any necessary memo field
    // });
    
    // const txBodyFields: TxBodyEncodeObject = {
    //   typeUrl: "/cosmos.tx.v1beta1.TxBody",
    //   value: {
    //     messages: [{
    //       typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
    //       value: deploymentData,
    //     }],
    //   },
    // };
    
    // const txBodyBytes2 = registry.encode(txBodyFields);
    // // new Uint8Array(txBodyFields)
    // console.log('the tx body byts')
    // console.log(txBodyBytes2)

    // // Serializando o corpo da transação corretamente
    // const txBodyBytes = TxBody.encode(txBody).finish();
    
    console.log('go to encode')
    const { accountNumber, sequence } = (await client2.getSequence(fromAddress))!;
    const feeAmount = coins(20000, "uakt");
    const gasLimit = 800000;
    console.log('go to make auth')
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubKeyEncoded, sequence }], feeAmount, gasLimit, undefined, undefined);

    const chainId = await client2.getChainId();
    console.log('the chain id')
    console.log(chainId)
    console.log('signing doc')
    const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = (sha256(signBytes));

    console.log('signing direct')
    const { signature } = await wallet.signDirect("akash14hh96u4tgzp64c5hvdkxzfdzx8vphsas9d2f8p", signDoc);
    const encoder = new TextEncoder();

    console.log('starting hash')
    // Cria o hash SHA-256 dos bytes do signDoc
    const hash = crypto.createHash('sha256').update(signBytes).digest();
    console.log('starting signing')
    const signatureUint8Array2 = new Uint8Array(hash);

    const caller = ic.caller().toUint8Array();
    const signatureResult = await ic.call(
        managementCanister.sign_with_ecdsa,
        {
            args: [
                {
                    message_hash: hashedMessage,
                    derivation_path: [caller],
                    key_id: {
                        curve: { secp256k1: null },
                        name: 'dfx_test_key'
                    }
                }
            ],
            cycles: 10_000_000_000n
        }
      );
      console.log(signatureResult)

    console.log(signatureResult.signature)

    console.log('comecando tx raw')

    console.log('the signature')
    const signatureBinary = Buffer.from(signature.signature, 'base64');
    const signatureUint8Array = new Uint8Array(signatureBinary);

    console.log('new serializing')
    const txRaw = TxRaw.fromPartial({
      bodyBytes: newBodyBytes,
      authInfoBytes: authInfoBytes,
      signatures: [signatureResult.signature], // Usar Uint8Array aqui
    });
  
    // Serializando o objeto TxRaw para Uint8Array
    const txRawBytes = TxRaw.encode(txRaw).finish();

    console.log('broadcasting new broad')
    const txResult = await client.broadcastTxSync(txRawBytes);
    return txResult

    // try {
    //   const result = await waitForTransaction(client, broadcast, 120000, 3000); // Espera 2 minutos
    //   console.log('Transaction confirmed:', result);
    //   return broadcast;
    // } catch (error) {
    //     console.error(error);
    //     return 'err';
    // }
  })

// Função para criar um Uint8Array de um objeto TxRaw
function createTxRawBytes(txRaw: TxRaw): Uint8Array {
  const size = txRaw.bodyBytes.length + txRaw.authInfoBytes.length + txRaw.signatures.reduce((sum, sig) => sum + sig.length, 0);
  const txRawBytes = new Uint8Array(size);

  let offset = 0;
  txRawBytes.set(txRaw.bodyBytes, offset);
  offset += txRaw.bodyBytes.length;

  txRawBytes.set(txRaw.authInfoBytes, offset);
  offset += txRaw.authInfoBytes.length;

  txRaw.signatures.forEach(signature => {
      txRawBytes.set(signature, offset);
      offset += signature.length;
  });

  return txRawBytes;
}

  function base64ToUint8Array(base64: any) {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}
      // const caller = ic.caller().toUint8Array();
    // const signatureResult = await ic.call(
    //     managementCanister.sign_with_ecdsa,
    //     {
    //         args: [
    //             {
    //                 message_hash: hash,
    //                 derivation_path: [caller],
    //                 key_id: {
    //                     curve: { secp256k1: null },
    //                     name: 'dfx_test_key'
    //                 }
    //             }
    //         ],
    //         cycles: 10_000_000_000n
    //     }
    // );
    // console.log(signatureResult)
    // const broadcast = await client.broadcastTxSync(signatureResult.signature)


function getCreateDeploymentMsg(deploymentData: any) {
    const message = {
      typeUrl: '/akash.deployment.v1beta3.MsgCreateDeployment',
      value: {
        id: deploymentData.deploymentId,
        groups: deploymentData.groups,
        version: deploymentData.version,
        deposit: deploymentData.deposit,
        depositor: deploymentData.depositor,
      },
    };

    return message;
  }

  async function getCurrentHeight(client: StargateClient): Promise<number> {
    const latestBlock = await client.getBlock();
    return latestBlock.header.height;
  }

  function isValidString(value: unknown): value is string {
    return typeof value === 'string' && !!value;
  }

  function getSdl(
    yamlJson: string | v2Sdl,
    networkType: 'beta2' | 'beta3',
    networkId: NetworkId,
  ) {
    return isValidString(yamlJson)
      ? SDL.fromString(yamlJson, networkType, networkId)
      : new SDL(yamlJson, networkType, networkId);
  }

  const getDenomFromSdl = (groups: any[]): string => {
    const denoms = groups
      .flatMap((g) => g.resources)
      .map((resource) => resource.price.denom);

    // TODO handle multiple denoms in an sdl? (different denom for each service?)
    return denoms[0];
  };

  async function NewDeploymentData(
    yamlStr: string,
    dseq: string | null,
    fromAddress: string,
    deposit = defaultInitialDeposit,
    depositorAddress: string | null = null,
  ) {
    try {
      console.log('sdl')
      const sdl = getSdl(yamlStr, 'beta3', 'mainnet');
      console.log('groups')
      const groups = sdl.groups();
      console.log('mani')
      const mani = sdl.manifest();
      console.log('denom')
      const denom = getDenomFromSdl(groups);
      console.log('version')
      const version = await sdl.manifestVersion();
      const _deposit = {
        denom,
        amount: deposit.toString(),
      };
      console.log('got sdl version and return')

      return {
        sdl: sdl.data,
        manifest: mani,
        groups: groups,
        deploymentId: {
          owner: fromAddress,
          dseq: dseq,
        },
        orderId: [],
        leaseId: [],
        version,
        deposit: _deposit,
        depositor: depositorAddress || fromAddress,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }