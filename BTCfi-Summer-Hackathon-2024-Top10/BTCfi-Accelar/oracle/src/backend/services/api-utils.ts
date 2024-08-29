import axios from "axios";

import { BASE_API_URL, networkVersion, networkVersionMarket } from "./constants";

export class ApiUrlService {
  static depositParams(apiEndpoint: string) {
    return `${apiEndpoint}/cosmos/params/v1beta1/params?subspace=deployment&key=MinDeposits`;
  }
  static deploymentList(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/akash/deployment/${networkVersion}/deployments/list?filters.owner=${address}`;
  }
  static deploymentDetail(apiEndpoint: string, address: string, dseq: string) {
    return `${apiEndpoint}/akash/deployment/${networkVersion}/deployments/info?id.owner=${address}&id.dseq=${dseq}`;
  }
  static bidList(apiEndpoint: string, address: string, dseq: string) {
    return `${apiEndpoint}/akash/market/${networkVersionMarket}/bids/list?filters.owner=${address}&filters.dseq=${dseq}`;
  }
  static bidInfo(apiEndpoint: string, address: string, dseq: string, gseq: number, oseq: number, provider: string) {
    return `${apiEndpoint}/akash/market/${networkVersionMarket}/bids/info?id.owner=${address}&id.dseq=${dseq}&id.gseq=${gseq}&id.oseq=${oseq}&id.provider=${provider}`;
  }
  static leaseList(apiEndpoint: string, address: string, dseq: string) {
    return `${apiEndpoint}/akash/market/${networkVersionMarket}/leases/list?filters.owner=${address}${dseq ? "&filters.dseq=" + dseq : ""}`;
  }
  static providers(apiEndpoint: string) {
    return `${apiEndpoint}/akash/provider/${networkVersion}/providers`;
  }
  static providerList() {
    return `${BASE_API_URL}/v1/providers`;
  }
  static providerDetail(owner: string) {
    return `${BASE_API_URL}/v1/providers/${owner}`;
  }
  static providerRegions() {
    return `${BASE_API_URL}/v1/provider-regions`;
  }
  static block(apiEndpoint: string, id: string) {
    return `${apiEndpoint}/blocks/${id}`;
  }
  static balance(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/bank/v1beta1/balances/${address}`;
  }
  static rewards(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/distribution/v1beta1/delegators/${address}/rewards`;
  }
  static redelegations(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/staking/v1beta1/delegators/${address}/redelegations`;
  }
  static delegations(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/staking/v1beta1/delegations/${address}`;
  }
  static unbonding(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
  }
  static granteeGrants(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/authz/v1beta1/grants/grantee/${address}`;
  }
  static granterGrants(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/authz/v1beta1/grants/granter/${address}`;
  }
  static allowancesIssued(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/feegrant/v1beta1/issued/${address}`;
  }
  static allowancesGranted(apiEndpoint: string, address: string) {
    return `${apiEndpoint}/cosmos/feegrant/v1beta1/allowances/${address}`;
  }
  static dashboardData() {
    return `${BASE_API_URL}/v1/dashboard-data`;
  }
  static marketData() {
    return `${BASE_API_URL}/v1/market-data`;
  }
  static proposals() {
    return `${BASE_API_URL}/v1/proposals`;
  }
  static apiProviders() {
    return `${BASE_API_URL}/v1/providers`;
  }
  static templates() {
    return `${BASE_API_URL}/v1/templates`;
  }
  static validators() {
    return `${BASE_API_URL}/v1/validators`;
  }
  static addressTransactions(address: string, skip: number, limit: number) {
    return `${BASE_API_URL}/v1/addresses/${address}/transactions/${skip}/${limit}`;
  }
  static graphData(snapshot: string) {
    return `${BASE_API_URL}/v1/graph-data/${snapshot}`;
  }
  static providerGraphData(snapshot: string) {
    return `${BASE_API_URL}/v1/provider-graph-data/${snapshot}`;
  }
  static providerActiveLeasesGraph(providerAddress: string) {
    return `${BASE_API_URL}/v1/provider-active-leases-graph-data/${providerAddress}`;
  }
  static providerAttributesSchema() {
    return `${BASE_API_URL}/v1/provider-attributes-schema`;
  }
  static networkCapacity() {
    return `${BASE_API_URL}/v1/network-capacity`;
  }
  static gpuModels() {
    return `${BASE_API_URL}/internal/gpu-models`;
  }
  // Github
  static auditors() {
    return `${BASE_API_URL}/v1/auditors`;
  }
  static mainnetNodes() {
    return `${BASE_API_URL}/v1/nodes/mainnet`;
  }
  static testnetNodes() {
    return `${BASE_API_URL}/v1/nodes/testnet`;
  }
  static sandboxNodes() {
    return `${BASE_API_URL}/v1/nodes/sandbox`;
  }
  static mainnetVersion() {
    return `${BASE_API_URL}/v1/version/mainnet`;
  }
  static testnetVersion() {
    return `${BASE_API_URL}/v1/version/testnet`;
  }
  static sandboxVersion() {
    return `${BASE_API_URL}/v1/version/sandbox`;
  }
}

// AKASH CONSOLE
export const mainnetNodes = ApiUrlService.mainnetNodes();
export const testnetNodes = ApiUrlService.testnetNodes();
export const sandboxNodes = ApiUrlService.sandboxNodes();

function hasQueryParam(url: string) {
  return /[?&]/gm.test(url);
}
