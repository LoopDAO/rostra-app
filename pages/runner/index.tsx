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
  const [condition, setCondition] = React.useState([])
  const [currentRunner, setCurrentRunner] = React.useState<any>()

  const {
    data: runnerListData,
    error: runnerListError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      accountFlash.address
        // ? `${process.env.NEXT_PUBLIC_API_BASE}/rule/get/${accountFlash.address}`
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rule/get`
        : null,
    fetchers.http
  )

  const { result: runnerList } = runnerListData || {}

  // const detailURL = runnerId ? `${process.env.NEXT_PUBLIC_API_BASE}/rule/${runnerId}` : null
  // let { data: currentResult } = useSWR(detailURL, fetchers.http);
  const getRunnerById = async (id: string) => {
    setRunnerId(id);

    const runner = await getRunnerInfo(id)
    setCurrentRunner(runner)
    setCondition(runner.action.condition)
    console.log('runner.condition: ', runner.action.condition, runner)

    const aggregator = cotaService.aggregator
    const nftInfo = await aggregator.getDefineInfo({
      cotaId: runner.nft,
    })
    setTotalSupply(nftInfo.issued)
  }

  const runRunner = async () => {
    await httpPost('/rule/refresh', { rule_id: runnerId })
  }

  const getRunnerAddressList = async (id: string) => {
    const res = await fetchers.http(`${process.env.NEXT_PUBLIC_API_BASE}/rule/${id}`)
    setCondition(res?.result?.result)
  }

  const getRunnerInfo = async (id: string) => {
    const res = await fetchers.http(`${process.env.NEXT_PUBLIC_API_BASE}/rule/${id}`)
    return res?.result
  }

  const deleteResult = async (address: string) => {
    await httpPost('/rule/delete', { rule_id: runnerId, address })
    await getRunnerAddressList(runnerId)
  }


  const trElems = condition.map((conditionItem: any, index) => {
    return (
      <Tr key={index}>
        <Td>
          <Box w='400px'>{conditionItem.with} </Box>
        </Td>
        <Td>
          <Box w='400px'>{conditionItem.of} </Box>
        </Td>
        {/* <Td><Button onClick={() => deleteResult(address)}>Delete</Button></Td> */}
      </Tr>
    )
  })

  const menu = (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{currentRunner?.name || 'Select runner'}</MenuButton>
      <MenuList>
        {/* MenuItems are not rendered unless Menu is open */}
        {
          runnerList?.map((runner: any) => {
            return (
              <MenuItem key={runner._id.$oid}>
                <Box onClick={() => getRunnerById(runner._id.$oid)}>
                  {runner.name}
                </Box>
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
          Runners
        </Heading>
        {menu}
        <Heading as='h4' size='md' my='15px'>
          {currentRunner?.name}
          <Button onClick={runRunner}>Run</Button>
        </Heading>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
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
