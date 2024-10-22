// random_address.ts

import { update, text, ic } from 'azle';
import { Bip39, Random, stringToPath } from '@cosmjs/crypto';
import { ethers } from 'ethers';
import {
    DirectSecp256k1HdWallet,
    DirectSecp256k1Wallet,
    OfflineSigner,
    Registry,
  } from '@cosmjs/proto-signing';
import {
    MsgCloseDeployment,
    MsgCreateDeployment,
  } from '@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg';
import { akash } from 'akashjs';
import { SDL } from '@akashnetwork/akashjs/build/sdl';
import { v2Sdl } from '@akashnetwork/akashjs/build/sdl/types';
import { NetworkId } from '@akashnetwork/akashjs/build/types/network';
import {
getAkashTypeRegistry,
getTypeUrl,
} from '@akashnetwork/akashjs/build/stargate/index';
import { StargateClient, SigningStargateClient, coins } from '@cosmjs/stargate';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import axios from 'axios';

//ATTENTION: THIS SCRIPT IS MADE TO CREATE AN AKASH DEPLOYMENT, TO MAKE IT WORK, IT WAS NECESSARY TO CHANGE THE FILE AT node_modules/@akashnetwork/akashjs/build/sdl/SDL/SDL.js, SINCE 
//azle does not accept node:crypto, was installed crypto-js and used in the place of node:crypto.

const akashPubRPC = 'https://akash-rpc.publicnode.com:443';
const defaultInitialDeposit = 500000;

export const yamlObj = `
# Welcome to the Akash Network! 🚀☁
# This file is called a Stack Definition Laguage (SDL)
# SDL is a human friendly data standard for declaring deployment attributes. 
# The SDL file is a "form" to request resources from the Network. 
# SDL is compatible with the YAML standard and similar to Docker Compose files.

---
# Indicates version of Akash configuration file. Currently only "2.0" is accepted.
version: "2.0"

# The top-level services entry contains a map of workloads to be ran on the Akash deployment. Each key is a service name; values are a map containing the following keys:
# https://akash.network/docs/getting-started/stack-definition-language/#services
services:
  # The name of the service "web"
  web:
    # The docker container image with version. You must specify a version, the "latest" tag doesn't work.
    image: akashlytics/hello-akash-world:0.2.0
    # You can map ports here https://akash.network/docs/getting-started/stack-definition-language/#servicesexpose
    expose:
      - port: 3000
        as: 80
        to:
          - global: true

# The profiles section contains named compute and placement profiles to be used in the deployment.
# https://akash.network/docs/getting-started/stack-definition-language/#profiles
profiles:
  # profiles.compute is map of named compute profiles. Each profile specifies compute resources to be leased for each service instance uses uses the profile.
  # https://akash.network/docs/getting-started/stack-definition-language/#profilescompute
  compute:
    # The name of the service
    web:
      resources:
        cpu:
          units: 0.5
        memory:
          size: 512Mi
        storage:
          size: 512Mi

# profiles.placement is map of named datacenter profiles. Each profile specifies required datacenter attributes and pricing configuration for each compute profile that will be used within the datacenter. It also specifies optional list of signatures of which tenants expects audit of datacenter attributes.
# https://akash.network/docs/getting-started/stack-definition-language/#profilesplacement
  placement:
    dcloud:
      pricing:
        # The name of the service
        web:
          denom: uakt
          amount: 1000

# The deployment section defines how to deploy the services. It is a mapping of service name to deployment configuration.
# https://akash.network/docs/getting-started/stack-definition-language/#deployment
deployment:
  # The name of the service
  web:
    dcloud:
      profile: web
      count: 1

`

export const createAkashDeployment = update([], text, async () => {
    const mnemonic = 'input your mnemonic';
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: 'akash',
    });

    // get first account
    const [account] = await wallet.getAccounts();

    const myRegistry = new Registry(getAkashTypeRegistry());
    console.log(myRegistry);
    myRegistry.register(
      '/akash.deployment.v1beta3.MsgCreateDeployment',
      MsgCreateDeployment,
    );
    
    const client = await SigningStargateClient.connectWithSigner(
      akashPubRPC,
      wallet,
      {
        registry: myRegistry,
      },
    );

    const currentHeight = await getCurrentHeight(client);
    const dseq = currentHeight.toString();

    const yamlStr = YAML.parse(yamlObj);
    const dd = await await NewDeploymentData(
      yamlStr,
      dseq,
      account.address,
      defaultInitialDeposit,
      null,
    );

    const finalM = getCreateDeploymentMsg(dd);
    console.log('finalM')
    console.log(finalM)

    const fee = {
      amount: [
        {
          denom: 'uakt',
          amount: '20000',
        },
      ],
      gas: '800000',
    };

    const signedMessage = await client.signAndBroadcastSync(
      account.address,
      [finalM],
      fee,
      'take up deployment',
    );
    console.log('signedMessage')
    console.log(signedMessage)

    try {
      const result = await waitForTransaction(client, signedMessage, 120000, 3000); // Espera 2 minutos
      console.log('Transaction confirmed:', result);
      return signedMessage;
  } catch (error) {
      console.error(error);
      return 'err';
  }
});

export async function waitForTransaction(client: StargateClient, txHash: string, timeout = 120000, interval = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
      const result = await client.getTx(txHash);
      if (result) {
          return result;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error(`Transaction with ID ${txHash} was submitted but was not yet found on the chain. You might want to check later. There was a wait of ${timeout / 1000} seconds.`);
}

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
      console.log(sdl)
      console.log('groups')
      const groups = sdl.groups();
      console.log(groups)
      console.log('mani')
      const mani = sdl.manifest();
      console.log(mani)
      console.log('denom')
      const denom = getDenomFromSdl(groups);
      console.log(denom)
      console.log('version')
      const version = await sdl.manifestVersion();
      console.log(version)
      const _deposit = {
        denom,
        amount: deposit.toString(),
      };

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