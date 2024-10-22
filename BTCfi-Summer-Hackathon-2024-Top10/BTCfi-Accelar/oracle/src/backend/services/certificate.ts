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
import { akashPubRPC } from './deployment_akash_2';

export const createCertificateAkashTest = update([text, text, text, text], text, async (fromAddress: string, pubKeyEncoded: string, certPem: string, certPubpem: string) => {
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
              cert: certPem,
              pubkey: certPubpem
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

      const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
      const signBytes = makeSignBytes(signDoc);
      const hashedMessage = (sha256(signBytes));

  
      const caller = await getDerivationPathFromAddressEVM(fromAddress)
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
  
      const txRaw = TxRaw.fromPartial({
        bodyBytes: newBodyBytes,
        authInfoBytes: authInfoBytes,
        signatures: [signatureResult.signature], // Usar Uint8Array aqui
      });
    
      // Serializando o objeto TxRaw para Uint8Array
      const txRawBytes = TxRaw.encode(txRaw).finish();
  
      const txResult = await client.broadcastTxSync(txRawBytes);
  
      try {
        const result = await waitForTransaction(client, txResult, 120000, 3000); // wait 2 minutes
        console.log('Transaction confirmed:', result);
        return result.hash;
      } catch (error) {
          console.error(error);
          return 'error';
      }
    })

export const createCertificateAkash = async (fromAddress: string, pubKeyEncoded: string, certPem: string, certPubpem: string) => {
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
            cert: certPem,
            pubkey: certPubpem
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

    const signDoc = makeSignDoc(newBodyBytes, authInfoBytes, chainId, accountNumber);
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = (sha256(signBytes));


    const caller = await getDerivationPathFromAddressEVM(fromAddress)
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

    const txRaw = TxRaw.fromPartial({
      bodyBytes: newBodyBytes,
      authInfoBytes: authInfoBytes,
      signatures: [signatureResult.signature], // Usar Uint8Array aqui
    });
  
    // Serializando o objeto TxRaw para Uint8Array
    const txRawBytes = TxRaw.encode(txRaw).finish();

    const txResult = await client.broadcastTxSync(txRawBytes);

    try {
      const result = await waitForTransaction(client, txResult, 120000, 3000); // wait 2 minutes
      console.log('Transaction confirmed:', result);
      return result.hash;
    } catch (error) {
        console.error(error);
        return 'error';
    }
  }