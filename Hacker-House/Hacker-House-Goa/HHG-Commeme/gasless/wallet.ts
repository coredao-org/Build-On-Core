import { createClient, createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { coreDao, polygon } from "viem/chains"
export type SupportChainId = 1116 | 137;
export const getChainObject = (chainId:SupportChainId) => {
    switch (chainId) {
        case 1116:
            return coreDao
        case 137:
            return polygon
    }
}
export const sendRawTransaction = async ({key,rpc,to,value,data,chainId}:{key: `0x${string}`;rpc:string;to:`0x${string}`;value:string;data:`0x${string}`,chainId:SupportChainId}) => {
    const account = privateKeyToAccount(key)
    const chainObject = getChainObject(chainId)
    const publicClient = createPublicClient({
        transport:http(rpc),
        chain:chainObject
    })
    const walletClient = createWalletClient({
        account,
        transport:http(rpc),
        chain:chainObject,

    })

   

    const hash = await walletClient.sendTransaction({
        to,
        value:BigInt(value),
        data,
    })
    await publicClient.waitForTransactionReceipt({
        hash,
        confirmations:1,
        
    })

    return hash
}   