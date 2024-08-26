// random_address.ts

import {
    update, 
    text, 
    ic,     
    init,
    nat32,
    Principal,
    query,
    Some,
    None,
    StableBTreeMap,     
    Canister,
    blob,
} from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
    managementCanister
} from 'azle/canisters/management';
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
import { getAddressAkash, getEcdsaPublicKeyBase64 } from './get_address_akash';
import { waitForTransaction, yamlObj } from './deployment_akash';
const CryptoJS = require("crypto-js");
import * as crypto from 'crypto';
import { decodeTxRaw } from "@cosmjs/proto-signing"
import { encodeLen } from "@dfinity/agent";
import { TxRaw, TxBody, Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgSend } from 'akashjs/types/proto/cosmos/bank/v1beta1/tx';
import { assert } from "@cosmjs/utils";
import { fromHex, toBase64, toHex } from "@cosmjs/encoding";
import { certificateManager } from '@akashnetwork/akashjs/build/certificates/certificate-manager';
import { MsgCreateCertificate } from '@akashnetwork/akashjs/build/protobuf/akash/cert/v1beta3/cert';
import { wait } from './timer';
import { ApiProviderList } from './provider';
import { PROVIDER_PROXY_URL } from './constants';
import { globalVar } from './deployment_akash_2';

//ATTENTION: THIS SCRIPT IS MADE TO CREATE AN AKASH DEPLOYMENT, TO MAKE IT WORK, IT WAS NECESSARY TO CHANGE THE FILE AT node_modules/@akashnetwork/akashjs/build/sdl/SDL/SDL.js, SINCE 
//azle does not accept node:crypto, was installed crypto-js and used in the place of node:crypto.

const akashPubRPC = 'https://akash-rpc.publicnode.com:443';
const defaultInitialDeposit = 500000;

export type LocalCert = {
    certPem: string;
    keyPem: string;
    address: string;
};

export let providerList: string


// export default Canister({

// });


export const sendManifestToProvider = async (providerURI: string, manifest: any, dseq: string, certPem: string, keyPem: string) => {
  
    let jsonStr = JSON.stringify(manifest);
    // jsonStr = jsonStr.replace(/"quantity":\{"val/g, '"size":{"val');
  
    // Waiting for 5 sec for provider to have lease
    await wait(5000);
  
    let response;
    const uri = providerURI + '/deployment/' + dseq + '/manifest'

    console.log('dados')
    console.log(uri)
    console.log('prox')
    console.log(jsonStr)
    for (let i = 1; i <= 3; i++) {
      console.log("Try #" + i);
      try {
        if (!response) {
            ic.setOutgoingHttpOptions({
                maxResponseBytes: 2_000n,
                cycles: 50_000_000n,
                transformMethodName: 'transformResponse'
            });
    
            const response = await ic.call(managementCanister.http_request, {
                args: [
                    {
                        url: `https://akash-provider-proxy.omnia-network.com/`,
                        max_response_bytes: Some(2_000n),
                        method: {
                            post: null
                        },
                        headers: [],
                        body: Some(
                            Buffer.from(
                                JSON.stringify({
                                    method: 'PUT',
                                    url: uri,
                                    certPem: certPem,
                                    keyPem: keyPem,
                                    body: jsonStr,
                                    timeout: 60_000
                                }),
                                'utf-8'
                            )
                        ),
                        transform: Some({
                            function: [ic.id(), 'transformResponse'] as [Principal, string],
                            context: Uint8Array.from([])
                        })
                    }
                ],
                cycles: 50_000_000n
            });
    
            const responseText = Buffer.from(response.body.buffer).toString('utf-8');
            console.log('deu bom sending url');
            console.log(responseText);
    
  
            i = 3;

            return responseText;
        }
      } catch (err: any) {
        console.log(err)
        if (err.includes && err.includes("no lease for deployment") && i < 3) {
          console.log("Lease not found, retrying...");
          await wait(6000); // Waiting for 6 sec
        } else {
          console.log('deu erro')
          console.log(err)
          throw new Error(err?.response?.data || err);
        }
      }
    }
  
    // Waiting for 5 sec for provider to boot up workload
    await wait(5000);
  
    return response;
};

export const getDeploymentManifestInfo = update([text, text, text, text], text, async (providerURI: string, dseq: string, gseq: string, oseq: string) => {
    try {
        ic.setOutgoingHttpOptions({
            maxResponseBytes: 2_000n,
            cycles: 50_000_000n,
            transformMethodName: 'transformResponse'
        });
        const newUrl = providerURI + '/lease/' + dseq + '/' + gseq + '/' + oseq + '/status'
        console.log(newUrl)
        const response = await ic.call(managementCanister.http_request, {
            args: [
                {
                    url: 'https://akash-provider-proxy.omnia-network.com/',
                    max_response_bytes: Some(2_000n),
                    method: {
                        post: null
                    },
                    headers: [],
                    body: Some(
                        Buffer.from(
                            JSON.stringify({
                                method: 'GET',
                                url: newUrl,
                                certPem: globalVar?.crtpem,
                                keyPem: globalVar?.privpem,
                            }),
                            'utf-8'
                        )
                    ),
                    transform: Some({
                        function: [ic.id(), 'transformResponse'] as [Principal, string],
                        context: Uint8Array.from([])
                    })
                }
            ],
            cycles: 50_000_000n
        });

        const responseText = Buffer.from(response.body.buffer).toString('utf-8');
        console.log(responseText);

        return responseText;
    } catch (err: any) {
        console.log(err);
        throw new Error(err.message || err);
    }
});

export const getManifestProviderUriValue = async (providerAddress: string) => {
    try {
        ic.setOutgoingHttpOptions({
            maxResponseBytes: 2_000_000n,
            cycles: 1_703_081_200n,
            transformMethodName: 'transformResponse'
        });

        const response = await ic.call(managementCanister.http_request, {
            args: [
                {
                    url: `https://api.cloudmos.io/v1/providers`,
                    max_response_bytes: Some(2_000_000n),
                    method: {
                        get: null
                    },
                    headers: [],
                    body: None,
                    transform: Some({
                        function: [ic.id(), 'transformResponse'] as [Principal, string],
                        context: Uint8Array.from([])
                    })
                }
            ],
            cycles: 1_703_081_200n
        });

        const responseText = Buffer.from(response.body.buffer).toString('utf-8');

        const value = JSON.parse(responseText).find((p: any) => p.owner === providerAddress)

        console.log("achei essa uri de probvider")
        console.log(value)

        return value.hostUri;
    } catch (err: any) {
        console.log(err);
        throw new Error(err.message || err);
    }
}