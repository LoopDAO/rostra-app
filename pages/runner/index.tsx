import React, { useEffect, useState } from "react"
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
import { generateMintCotaTx, MintCotaInfo, } from '@nervina-labs/cota-sdk'
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"
import fetchers from "api/fetchers"
import httpPost from 'api/post'
import useSWR from 'swr'

export default function ReportingPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()

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
      account.address
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rule/walletaddr/${account.address}`
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
    setTotalSupply(nftInfo?.issued)
  }

  const runRunner = async () => {
    await httpPost('/result/refresh', { rule_id: runnerId })
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
              <MenuItem key={runner._id.$oid} onClick={() => getRunnerById(runner._id.$oid)}>
                {runner.name}
              </MenuItem>
            )
          })
        }

      </MenuList>
    </Menu >
  )

  let detail
  if (currentRunner) {
    const runBtn = currentRunner.finished === false ? <Button onClick={() => runRunner()}>{t('Execute')}</Button> : null
    console.log('currentRunner.finished: ', currentRunner?.finished)

    detail = (
      <Box>
        <Heading as='h4' size='md' my='15px'>
          Rules
          {runBtn}
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
      </Box>
    )
  }

  return (
    <>
      <Sidebar>
        <Heading as='h4' size='md' my='15px'>
          Runners
        </Heading>
        {menu}
        {detail}
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
