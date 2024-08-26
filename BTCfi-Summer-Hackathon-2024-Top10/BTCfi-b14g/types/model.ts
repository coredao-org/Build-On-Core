// Crawl from pledgeAgent coredao
export interface DelegatedModel {
  delegator: string
  histories: DelegateHistory[]
}
export interface DelegateHistory {
  agent: string
  bitcoinTxId: string
  blockHeight: string
  coreTxId: string
  outputIndex: string
  script: string
  value: string
  endRound: string
  fromCoreReal?: boolean 
}
// Restake histories each validator
export interface RestakeModel {
  stakerAddress: string
  validatorAddress: string
  coreTxId: string
  bitcoinTxId: string
  unlockTime: string
  coreAmount: string
  btcAmount: string
}

export type RestakeHistory = {
  delegatorsCount: number | null
  data: Omit<RestakeModel, 'validatorAddress'>[]
  page: number
  totalPage: number
  totalCount: number
}

export type RestakeHistoryWithLoading = {
  data: RestakeHistory['data']
  isLoading: boolean
  page: number
  totalPage: number
  totalCount: number
}
// Claim Event
export interface ClaimModel {
  coreTxId: string
  delegatorAddress: string
  btcAmount: string
}

export type ClaimHistoryWithLoading = {
  data: Array<ClaimModel>
  isLoading: boolean
  page: number
  totalPage: number
  totalCount: number
}


// Dashboard
export interface Dashboard {
  metrics: Metrics
  validators: Array<Validator>
}
export interface Metrics {
  validatorsCount: number
  totalCoreAmount: string
  totalBtcAmount: string
}

export interface Validator {
  coreAmount: string
  btcAmount: string
  validatorAddress: string
  delegatorsCount: number
}
