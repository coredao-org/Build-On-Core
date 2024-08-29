import { update, text, ic } from 'azle';
import {
    DirectSecp256k1HdWallet,
    Registry,
    makeSignDoc,
    makeAuthInfoBytes,
    TxBodyEncodeObject,
  } from '@cosmjs/proto-signing';
import {
    MsgCreateDeployment,
  } from '@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg';
import { SDL } from '@akashnetwork/akashjs/build/sdl';
import { v2Sdl } from '@akashnetwork/akashjs/build/sdl/types';
import { NetworkId } from '@akashnetwork/akashjs/build/types/network';
import { StargateClient, SigningStargateClient, coins, MsgSendEncodeObject } from '@cosmjs/stargate';
import * as YAML from 'yaml';
import { waitForTransaction, yamlObj } from './deployment_akash';
import { TxRaw, TxBody, Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

const akashPubRPC = 'https://akash-rpc.publicnode.com:443';
const defaultInitialDeposit = 500000;

export const prepareAkashDeploymentMsg = update([], text, async () => {
    const accountAddress = 'akash14hh96u4tgzp64c5hvdkxzfdzx8vphsas9d2f8p'
    const client = await StargateClient.connect(akashPubRPC);

    const currentHeight = await getCurrentHeight(client);
    const dseq = currentHeight.toString();
    const yamlStr = YAML.parse(yamlObj);

    const deploymentData = await NewDeploymentData(
      yamlStr,
      dseq,
      accountAddress,
      defaultInitialDeposit
    );

    const createDeploymentMsg = getCreateDeploymentMsg(deploymentData);
    const value = MsgCreateDeployment.fromPartial(createDeploymentMsg.value)

    const pubkey: any = accountAddress
  
    const mnemonic = 'input here mnemonic';
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: 'akash',    
    });
    const myRegistry = new Registry();
    
    myRegistry.register('/akash.deployment.v1beta3.MsgCreateDeployment', MsgCreateDeployment);
    myRegistry.register('/cosmos.tx.v1beta1.TxBody', TxBody);
    

    // the other client who would, in the final app workflow, sign the transaction
    const client2 = await SigningStargateClient.connectWithSigner(
      akashPubRPC,
      wallet,
      {
        registry: myRegistry,
      },
    );
    
    const txBodyFields: TxBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: {
        messages: [{
          typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
          value: deploymentData,
        }],
      },
    };
    
    const txBodyBytes = myRegistry.encode(txBodyFields);

    const { accountNumber, sequence } = (await client.getSequence(accountAddress))!;
    const feeAmount = coins(20000, "uakt");
    const gasLimit = 800000;
    console.log('go to make auth')
    const authInfoBytes = makeAuthInfoBytes([{ pubkey, sequence }], feeAmount, gasLimit, undefined, undefined);

    const chainId = await client.getChainId();
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);

    const { signature } = await wallet.signDirect("akash14hh96u4tgzp64c5hvdkxzfdzx8vphsas9d2f8p", signDoc);

    const signatureBinary = Buffer.from(signature.signature, 'base64');
    const signatureUint8Array = new Uint8Array(signatureBinary);

    const txRaw = TxRaw.fromPartial({
      bodyBytes: txBodyBytes,
      authInfoBytes: authInfoBytes,
      signatures: [signatureUint8Array],
    });
  
    const txRawBytes = TxRaw.encode(txRaw).finish();

    const txResult = await client2.broadcastTxSync(txRawBytes);
    return txResult
  })

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