import {
  Service,
  Collector,
  Aggregator,
} from '@nervina-labs/cota-sdk'

export const padStr = (str: string) => '0x' + str.padStart(8, '0');

export const ckbNodeUrl = process.env.NEXT_PUBLIC_CKB_NODE_URL as string
export const ckbIndexerUrl = process.env.NEXT_PUBLIC_CKB_INDEXER_URL as string
export const registryUrl = process.env.NEXT_PUBLIC_REGISTRY_URL as string
export const cotaUrl = process.env.NEXT_PUBLIC_COTA_URL as string

export const cotaService: Service = {
  collector: new Collector({
    ckbNodeUrl,
    ckbIndexerUrl,
  }),
  aggregator: new Aggregator({
    registryUrl,
    cotaUrl,
  }),
}

export const ckb = cotaService.collector.getCkb()

export const hexToBalance = (hex: string) => (parseInt(hex || '0', 16) / 10 ** 8)

export const chainType = process.env.NEXT_PUBLIC_CHAIN_TYPE || "mainnet"

export const isMainnet = chainType === "mainnet"
