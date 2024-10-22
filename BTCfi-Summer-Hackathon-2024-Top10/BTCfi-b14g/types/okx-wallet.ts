
import { btcNetwork } from '@/constant/network'
import { Nullable } from '@/types';

export namespace Okx {
  export interface Wallet {
    [btcNetwork]: Provider
    request(request: { method: string; params?: Array<any> | Record<string, any> }): Promise<any>
    on: (event: Event, callback: (...args: any[]) => void) => void
  }

  export type Provider = Nullable<{
    connect: () => Promise<Okx.Account>
    signMessage: (signStr: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>
    signPsbt: (psbtHex: string, options?: SignOptions) => Promise<string>
    signPsbts: (psbtHexs: string[], options?: SignOptions) => Promise<string[]>
    pushTx: (hex: string) => Promise<string>
    on: (event: Event, callback: (...args: any[]) => void) => void
  }>

  export type Account = Nullable<{
    address: string
    publicKey: string
    compressedPublicKey: string
  }>

  export interface SignOptions {
    autoFinalized?: boolean
    toSignInputs: Array<{
      index: number
      address?: string
      publicKey?: string
      sighashTypes?: number[]
      disableTweakSigner?: boolean
    }>
  }

  export type Event = 'accountChanged' | 'connect' | 'accountsChanged' | 'chainChanged'
}
