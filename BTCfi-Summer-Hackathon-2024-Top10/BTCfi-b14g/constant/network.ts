export enum BtcNetwork {
  bitcoinSignet = 'bitcoinSignet',
  bitcoin = 'bitcoin',
  bitcoinTestnet = 'bitcoinTestnet'
}

export const btcNetwork = BtcNetwork.bitcoinSignet

export const mempoolNetwork = 'testnet'

export const coreTestnetNetwork = {
  chainId: '0x45b',
  chainName: 'Core Testnet',
  rpcUrl: 'https://rpc.test.btcs.network',
  blockExplorerUrl: 'https://scan.test.btcs.network',
}

export const coreNetwork = coreTestnetNetwork
export const mempoolUrl = "https://mempool.space"