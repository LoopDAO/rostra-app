import {
  addressToScript,
} from '@nervosnetwork/ckb-sdk-utils'
import { ckbIndexerUrl } from "@lib/utils/ckb"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { hexToBalance } from '@lib/utils/ckb'

export default function Balance({ address }: { address: string }) {
  const script = addressToScript(address)
  const { data } = useSWR(() => [ckbIndexerUrl, script], fetchers.getCellsCapacity)

  const balance = hexToBalance(data?.result?.capacity)

  return <>{balance}</>
}
