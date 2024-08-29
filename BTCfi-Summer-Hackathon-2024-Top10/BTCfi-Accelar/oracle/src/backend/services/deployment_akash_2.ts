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
import Long from "long";
import {
    MsgCloseDeployment,
    MsgCreateDeployment,
  } from '@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg';
import {
    MsgCreateLease
  } from '@akashnetwork/akashjs/build/protobuf/akash/market/v1beta4/lease';

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
import { getAddressAkash, getAddressAkashFromEVM, getDerivationPathFromAddressEVM, getEcdsaPublicKeyBase64, getEcdsaPublicKeyBase64FromEVM } from './get_address_akash';
import { waitForTransaction, yamlObj } from './deployment_akash';
const CryptoJS = require("crypto-js");
import { managementCanister } from 'azle/canisters/management';
import * as crypto from 'crypto';
import { decodeTxRaw } from "@cosmjs/proto-signing"
import { encodeLen } from "@dfinity/agent";
import { TxRaw, TxBody, Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { assert } from "@cosmjs/utils";
import { fromHex, toBase64, toHex } from "@cosmjs/encoding";
import { certificateManager } from '@akashnetwork/akashjs/build/certificates/certificate-manager';
import { MsgCreateCertificate } from '@akashnetwork/akashjs/build/protobuf/akash/cert/v1beta3/cert';
import { getManifestProviderUriValue, sendManifestToProvider } from './manifest';

//ATTENTION: THIS SCRIPT IS MADE TO CREATE AN AKASH DEPLOYMENT, TO MAKE IT WORK, IT WAS NECESSARY TO CHANGE THE FILE AT node_modules/@akashnetwork/akashjs/build/sdl/SDL/SDL.js, SINCE 
//azle does not accept node:crypto, was installed crypto-js and used in the place of node:crypto.

export const akashPubRPC = 'https://akash-rpc.publicnode.com:443';
const defaultInitialDeposit = 500000;

// Função para preparar uma mensagem de transação
export const createDeploymentAkash = update([], text, async () => {
  const fromAddress = await getAddressAkash()
  const pubKeyEncoded = await getEcdsaPublicKeyBase64()

  const registry = new Registry();
  
  registry.register('/akash.deployment.v1beta3.MsgCreateDeployment', MsgCreateDeployment);
  
  const client = await StargateClient.connect(akashPubRPC);

  const currentHeight = await getCurrentHeight(client);
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

    console.log('go to encode')
    const { accountNumber, sequence } = (await client.getSequence(fromAddress))!;
    const feeAmount = coins(20000, "uakt");
    const gasLimit = 800000;
    console.log('go to make auth')
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubKeyEncoded, sequence }], feeAmount, gasLimit, undefined, undefined);

    const chainId = await client.getChainId();
    console.log('the chain id')
    console.log(chainId)
    console.log('signing doc')
    const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = (sha256(signBytes));

    console.log('signing direct')
    const encoder = new TextEncoder();

    console.log('starting hash')

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

export const transferAkashTokens = update([text, text, text], text, async (fromAddressEVM: string, toAddress: string, amount: string) => {
    try {
        const fromAddress = await getAddressAkashFromEVM(fromAddressEVM);
        const pubKeyEncoded = await getEcdsaPublicKeyBase64FromEVM(fromAddressEVM);

        const registry = new Registry();

        const client = await StargateClient.connect(akashPubRPC);

        const msgSend = {
            fromAddress,
            toAddress,
            amount: [
                {
                    denom: "uakt",
                    amount
                }
            ]
        };

        const newBodyBytes = registry.encode({
            typeUrl: "/cosmos.tx.v1beta1.TxBody",
            value: {
                messages: [
                    {
                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                        value: msgSend,
                    },
                ],
            },
        } as EncodeObject);

        const { accountNumber, sequence } = await client.getSequence(fromAddress);
        const feeAmount = coins(20000, "uakt");
        const gasLimit = 800000;
        const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubKeyEncoded, sequence }], feeAmount, gasLimit);

        const chainId = await client.getChainId();
        const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
        const signBytes = makeSignBytes(signDoc);
        const hashedMessage = sha256(signBytes);

        const caller = ic.caller().toUint8Array();
        const derivationPath = await getDerivationPathFromAddressEVM(fromAddressEVM);
        const signatureResult = await ic.call(
            managementCanister.sign_with_ecdsa,
            {
                args: [
                    {
                        message_hash: hashedMessage,
                        derivation_path: [derivationPath],
                        key_id: {
                            curve: { secp256k1: null },
                            name: 'dfx_test_key'
                        }
                    }
                ],
                cycles: 10_000_000_000n
            }
        );

        const txRaw = TxRaw.fromPartial({
            bodyBytes: newBodyBytes,
            authInfoBytes: authInfoBytes,
            signatures: [signatureResult.signature],
        });

        const txRawBytes = TxRaw.encode(txRaw).finish();

        const txResult = await client.broadcastTxSync(txRawBytes);
        return `Transaction Result: ${txResult}`;
    } catch (error: any) {
        console.error(error);
        throw new Error(`Failed to transfer tokens: ${error.message}`);
    }
});

export const closeDeploymentAkash = update([text], text, async (dseq: string) => {
  console.log('value I received')
  console.log(dseq)
  const fromAddress = await getAddressAkash()
  const pubKeyEncoded = await getEcdsaPublicKeyBase64()

  const registry = new Registry();
  
  registry.register('/akash.deployment.v1beta3.MsgCloseDeployment', MsgCloseDeployment);
  
  const client = await StargateClient.connect(akashPubRPC);

  const closeData = await NewCloseDeploymentData(
    dseq,
    fromAddress,
  );
  console.log('after deployment data')

  const newBodyBytes = registry.encode({
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: {
      messages: [
        {
          typeUrl: "/akash.deployment.v1beta3.MsgCloseDeployment",
          value: closeData,
        },
      ],
    },
  } as EncodeObject);

    const { accountNumber, sequence } = (await client.getSequence(fromAddress))!;
    const feeAmount = coins(20000, "uakt");
    const gasLimit = 800000;

    console.log('go to make auth')
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubKeyEncoded, sequence }], feeAmount, gasLimit, undefined, undefined);

    const chainId = await client.getChainId();

    console.log('signing doc')
    const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = (sha256(signBytes));

    console.log('signing call')
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

    console.log('new serializing')
    const txRaw = TxRaw.fromPartial({
      bodyBytes: newBodyBytes,
      authInfoBytes: authInfoBytes,
      signatures: [signatureResult.signature],
    });
  
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

export let globalVar = {
  crtpem: ``,
  pubpem: ``,
  privpem: ``,
}

export const createCertificateAkash = update([], text, async () => {
  const fromAddress = await getAddressAkash()
  const pubKeyEncoded = await getEcdsaPublicKeyBase64()

  const registry = new Registry();
  
  registry.register('/akash.cert.v1beta3.MsgCreateCertificate', MsgCreateCertificate);
  
  const client = await StargateClient.connect(akashPubRPC);

  const newBodyBytes = registry.encode({
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: {
      messages: [
        {
          typeUrl: "/akash.cert.v1beta3.MsgCreateCertificate",
          value: {
            owner: fromAddress,
            cert: Buffer.from(globalVar[`crtpem`]).toString("base64"),
            pubkey: Buffer.from(globalVar[`pubpem`]).toString("base64")
          },
        },
      ],
    },
  } as EncodeObject);

    console.log('go to encode')
    const { accountNumber, sequence } = (await client.getSequence(fromAddress))!;
    const feeAmount = coins(20000, "uakt");
    const gasLimit = 800000;
    console.log('go to make auth')
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubKeyEncoded, sequence }], feeAmount, gasLimit, undefined, undefined);

    const chainId = await client.getChainId();
    console.log('the chain id')
    console.log(chainId)
    console.log('signing doc')
    const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = (sha256(signBytes));

    console.log('signing direct')
    const encoder = new TextEncoder();

    console.log('starting hash')

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

export const createLeaseAkash = update([text, text, text, text, text], text, async (
  dseq: string,
  owner?: string,
  gseq?: string,
  provider?: string,
  oseq?: string) => {
  console.log('value I received')
  console.log(dseq)
  const fromAddress = await getAddressAkash()
  const pubKeyEncoded = await getEcdsaPublicKeyBase64()

  const registry = new Registry();
  
  registry.register('/akash.market.v1beta4.MsgCreateLease', MsgCreateLease);
  
  const client = await StargateClient.connect(akashPubRPC);

  const newBodyBytes = registry.encode({
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: {
      messages: [
        {
          typeUrl: "/akash.market.v1beta4.MsgCreateLease",
          value: {
              bidId: {
                owner,
                dseq: Long.fromString(dseq, true),
                gseq,
                oseq,
                provider,
            }
          },
        },
      ],
    },
  } as EncodeObject);

    const { accountNumber, sequence } = (await client.getSequence(fromAddress))!;
    const feeAmount = coins(20000, "uakt");
    const gasLimit = 890000;

    console.log('go to make auth')
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubKeyEncoded, sequence }], feeAmount, gasLimit, undefined, undefined);

    const chainId = await client.getChainId();

    console.log('signing doc')
    const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = (sha256(signBytes));

    console.log('signing call')
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

    console.log('new serializing')
    const txRaw = TxRaw.fromPartial({
      bodyBytes: newBodyBytes,
      authInfoBytes: authInfoBytes,
      signatures: [signatureResult.signature],
    });
  
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

export const sendManifestAkash = update([text, text], text, async (
    dseq: string,
    provider: string,
) => {
    const providerUri = await getManifestProviderUriValue(provider)

    console.log('sending manifest')

    const yamlStr = YAML.parse(yamlObj);
    console.log('after yaml string')
  
    const manifestReturn = await sendManifestToProvider(providerUri, yamlStr, dseq, globalVar.crtpem, globalVar.privpem)
  
    console.log('passou manifest return')
    return 'done'
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

async function NewCloseDeploymentData(
  dseq: string | null,
  fromAddress: string,
) {
  try {
    return {
      id: {
        owner: fromAddress,
        dseq: dseq,
      },
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function NewCreateCertificateData(
  pubkey: Uint8Array,
  cert: Uint8Array,
  owner: string,
) {
  try {
    return {
      owner,
      cert,
      pubkey,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function NewCreateLeaseData(
  owner: string | undefined,
  dseq: string | undefined,
  gseq: number | undefined,
  provider: string | undefined,
  oseq: number | undefined,
) {
  try {
    return {
      bidId: {
        owner,
        dseq,
        gseq,
        provider,
        oseq,
      },
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}