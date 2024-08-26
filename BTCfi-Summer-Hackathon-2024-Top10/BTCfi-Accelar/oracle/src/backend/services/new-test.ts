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
import { getEcdsaPublicKeyBase64 } from './get_address_akash';
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

const akashPubRPC = 'https://akash-rpc.publicnode.com:443';
const defaultInitialDeposit = 500000;


export const createAndStoreCertificateKeys = update([], text, async () => {
    const { cert: crtpem, publicKey: pubpem, privateKey: privpem } = certificateManager.generatePEM('akash1kcd420c946rqa9sdl8qkdpaazpcghxdut0fqaz');
  
    // globalVar[`crtpem`] = crtpem
    // globalVar[`pubpem`] = pubpem
    // globalVar[`privpem`] = privpem
  
    // console.log(JSON.stringify(crtpem))
    // console.log(JSON.stringify(pubpem))
    // console.log(JSON.stringify(privpem))
  
    return `200`
   })