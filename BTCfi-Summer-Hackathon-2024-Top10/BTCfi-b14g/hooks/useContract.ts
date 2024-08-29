import {
  BaseContract,
  BrowserProvider,
  Contract,
  InterfaceAbi,
  JsonRpcProvider,
  JsonRpcSigner,
} from 'ethers';

import { useMemo } from 'react';

type Nullable<T> = T | null;

export function useContract<T extends Contract | BaseContract = Contract>(
  address: string,
  ABI: InterfaceAbi,
  provider: Nullable<BrowserProvider | JsonRpcProvider>,
  signer: Nullable<JsonRpcSigner>,
): T | null {
  const contract = useMemo(() => {
    if (!address || !ABI || !provider) return null;
    const baseContract = new Contract(address, ABI, provider);
    return signer ? (baseContract.connect(signer) as T) : (baseContract as T);
  }, [signer, provider, address, ABI]);

  return contract;
}
