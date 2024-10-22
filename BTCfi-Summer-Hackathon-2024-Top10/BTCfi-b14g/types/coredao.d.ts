// /api/staking/search_candidate_page

export interface SearchCandidateCoreDao {
  code: string
  data: Data
  message: string
}

export interface Data {
  records: Record[]
  total: number
  size: number
  pageSize: number
  current: number
  pageNum: number
  orders: Order[]
  optimizeCountSql: boolean
  hitCount: boolean
  countId: any
  maxLimit: any
  limitTotal: any
  searchCount: boolean
  pages: number
}

export interface Record {
  id: number
  operatorAddressHash: string
  operatorAddress: OperatorAddress
  consensusAddressHash: string
  consensusAddress: ConsensusAddress
  commission: number
  apr: string
  btcStakeApr: string
  status: number
  active: boolean
  coinPower: string
  btcPower: string
  nextRoundBtcPower: string
  coinRate: string
  hashPower: string
  score: string
  hashPowerRate: string
  btcPowerRate: string
  totalDeposit: string
  feeAddressHash: string
  btcPkHash: any
  deleted: number
  proportion: string
  coinIntegral: string
  hashIntegral: string
  btcIntegral: string
  nextRoundHashCnt: string
}

export interface OperatorAddress {
  hash: string
  publicName: any
  tokenName: any
  privateName: any
  symbol: any
  type: string
  privateNote: any
  candidateLogo: string
  candidateName: string
  isCandidate: boolean
  decimalValue: number
  domainName: any
}

export interface ConsensusAddress {
  hash: string
  publicName: any
  tokenName: any
  privateName: any
  symbol: any
  type: string
  privateNote: any
  candidateLogo?: string
  candidateName?: string
  isCandidate: boolean
  decimalValue: number
  domainName: any
}

export interface Order {
  column: string
  asc: boolean
}
