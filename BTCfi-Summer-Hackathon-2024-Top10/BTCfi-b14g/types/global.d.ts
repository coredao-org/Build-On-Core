import { Okx } from './okx-wallet'
declare global {
  interface Window {
    okxwallet: Okx.Wallet
  }
}
