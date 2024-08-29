export const shortenString = (address : string, sliceNumberOpts = 6) => `${address.slice(0,sliceNumberOpts)}...${address.slice(-sliceNumberOpts)}`
export function reserveBytes(txHashTemp: string) {
  let txHash = ''
  if (txHashTemp.length % 2 == 1) {
    txHashTemp = '0' + txHashTemp
  }
  txHashTemp = txHashTemp.split('').reverse().join('')
  for (let i = 0; i < txHashTemp.length - 1; i += 2) {
    txHash += txHashTemp[i + 1] + txHashTemp[i]
  }
  return txHash
}