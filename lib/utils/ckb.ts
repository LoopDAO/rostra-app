import {
  Service,
  Collector,
  Aggregator,
} from '@nervina-labs/cota-sdk'

export const getSecp256k1CellDep = (isMainnet: boolean): CKBComponents.CellDep => {
  if (isMainnet) {
    return {
      outPoint: {
        txHash: "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
        index: "0x0",
      }, depType: 'depGroup'
    }
  }
  return {
    outPoint: {
      txHash: "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
      index: "0x0",
    }, depType: 'depGroup'
  }
}

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