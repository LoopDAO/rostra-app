import React, { useEffect } from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Sidebar from "@components/Layout/Sidebar"
import { addressToScript, serializeScript, } from '@nervosnetwork/ckb-sdk-utils'
import { generateMintCotaTx, MintCotaInfo, } from '@nervina-labs/cota-sdk'
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"
import fetchers from "api/fetchers"
import httpPost from 'api/post'
import useSWR from 'swr'

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'

const secp256k1Dep = getSecp256k1CellDep(false)

export default function ReportingPage() {
  const { t } = useTranslation()
  const { isLoggedIn: isLoggedInFlash, account: accountFlash } = useAccountFlashsigner()
  const [totalSupply, setTotalSupply] = React.useState(0)
  const [runnerId, setRunnerId] = React.useState('')
  const [ruleId, setRuleId] = React.useState('')
  const [addressList, setAddressList] = React.useState([])
  const [currentRunner, setCurrentRunner] = React.useState<any>()

  const {
    data: runnerResultListData,
    error: runnerResultListError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      accountFlash.address
        ? `${process.env.NEXT_PUBLIC_API_BASE}/result/get/walletaddr/${accountFlash.address}`
        : null,
    fetchers.http
  )

  const { result: runnerResultList } = runnerResultListData || {}

  // const detailURL = runnerId ? `${process.env.NEXT_PUBLIC_API_BASE}/result/${runnerId}` : null
  // let { data: currentResult } = useSWR(detailURL, fetchers.http);
  const getResultById = async (id: string, ruleId: string) => {
    setRunnerId(id);
    setRuleId(ruleId)
    await getResultAddressList(id)
    const rule = await getRunnerInfo(ruleId)
    const aggregator = cotaService.aggregator
    const nftInfo = await aggregator.getDefineInfo({
      cotaId: rule.nft,
    })
    setTotalSupply(nftInfo.issued)
  }

  const getResultAddressList = async (id: string) => {
    const res = await fetchers.http(`${process.env.NEXT_PUBLIC_API_BASE}/result/${id}`)
    setAddressList(res?.result?.result)
  }

  const getRunnerInfo = async (id: string) => {
    const res = await fetchers.http(`${process.env.NEXT_PUBLIC_API_BASE}/rule/${id}`)
    setCurrentRunner(res?.result)
    return res?.result
  }

  const deleteResult = async (address: string) => {
    await httpPost('/result/delete', { rule_id: ruleId, address })
    await getResultAddressList(runnerId)
  }

  const sendNFT = async () => {
    let startIndex = totalSupply
    const mintLock = addressToScript(TEST_ADDRESS)
    const withdrawals = addressList.map((address, index) => {
      const tokenIndex = padStr((startIndex++).toString(16))
      return {
        tokenIndex,
        state: '0x00',
        characteristic: '0x0000000000000000000000000000000000000000',
        toLockScript: serializeScript(addressToScript(address)),
      }
    })

    const mintCotaInfo: MintCotaInfo = {
      cotaId: currentRunner?.nft,
      withdrawals,
    }
    let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo)

    rawTx.cellDeps.push(secp256k1Dep)

    const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
    let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
    console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
  }

  const trElems = addressList.map((address, index) => {
    return (
      <Tr key={address}>
        <Td>
          <Box w='400px'>{address}</Box>
          </Td>
        <Td><Button onClick={() => deleteResult(address)}>Delete</Button></Td>
      </Tr>
    )
  })

  const menu = (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{currentRunner?.rule_name || 'Select runner'}</MenuButton>
      <MenuList>
        {/* MenuItems are not rendered unless Menu is open */}
        {
          runnerResultList?.map((result: any) => {
            return (
              <MenuItem key={result._id.$oid} onClick={() => getResultById(result._id.$oid, result.rule_id)}>
                {result.rule_name}
              </MenuItem>
            )
          })
        }

      </MenuList>
    </Menu >
  )
  return (
    <>
      <Sidebar>
        <Heading as='h4' size='md' my='15px'>
          Results
        </Heading>
        {menu}
        <Heading as='h4' size='md' my='15px'>
          Data ({addressList.length})
        </Heading>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trElems}
          </Tbody>
        </Table>
        <Heading as='h4' size='md' my='15px'>
          NFT
        </Heading>
        <Box>Issued: {totalSupply}</Box>
        <Button
          mt={4}
          colorScheme="teal"
          onClick={sendNFT}
        >
          Send NFT
        </Button>
      </Sidebar>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
