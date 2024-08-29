import { coreTestnetNetwork } from '@/constant/network'

export const switchOrCreateNetwork = async (chainId: string) => {
  if (chainId === coreTestnetNetwork.chainId) return
  try {
    await window.okxwallet.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: coreTestnetNetwork.chainId }],
    })
  } catch (switchError) {
    console.log('🚀 ~ switchOrCreateNetwork ~ switchError:', switchError)
    if (switchError && typeof switchError === 'object' && 'code' in switchError && switchError.code === 4902) {
      try {
        await window.okxwallet.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: coreTestnetNetwork.chainId,
              chainName: coreTestnetNetwork.chainName,
              rpcUrls: [coreTestnetNetwork.rpcUrl],
              blockExplorerUrls: [coreTestnetNetwork.blockExplorerUrl],
            },
          ],
        })
      } catch (addError) {
        console.log('🚀 ~ switchOrCreateNetwork ~ addError:', addError)
        throw new Error('Switch network failed')
      }
    } else {
      throw new Error('Switch network failed')
    }
  }
}
