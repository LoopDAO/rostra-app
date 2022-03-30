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
} from '@chakra-ui/react'
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Sidebar from "@components/Layout/Sidebar"
import { addressToScript, serializeScript, } from '@nervosnetwork/ckb-sdk-utils'
import { generateMintCotaTx, MintCotaInfo, } from '@nervina-labs/cota-sdk'
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"
import fetchers from "api/fetchers"
import useSWR from "swr"

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'

const secp256k1Dep = getSecp256k1CellDep(false)

let cotaId: string = '0xd3b2bc022b52ce7282b354d97f9e5e5baf6698d7'

export default function SettingPage() {
  const { t } = useTranslation()
  const { isLoggedIn: isLoggedInFlash, account: accountFlash } = useAccountFlashsigner()
  const [totalSupply, setTotalSupply] = React.useState(0)

  const {
    data: runnerResultListData,
    error: runnerResultListError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      accountFlash.address
        // ? `${process.env.NEXT_PUBLIC_API_BASE}/rostra/runresult/get/${accountFlash.address}`
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rostra/runresult/get/`
        : null,
    fetchers.http
  )

  const { result: runnerResultList } = runnerResultListData || {}
  console.log('runnerResultList: ', runnerResultList)
  useEffect(() => {
    const aggregator = cotaService.aggregator
    const fetchData = async () => {
      const nftInfo = await aggregator.getDefineInfo({
        cotaId,
      })
      setTotalSupply(nftInfo.issued)
      console.log('nftInfo: ', nftInfo)
    }
    fetchData()
  }, [])

  const addressList = [
    "ckt1qyqfwyghxgvf3522cgutpaqruyy3gqugk3zqa8yddf",
    "ckt1qpth5hjexr3wehtzqpm97dzzucgemjv7sl05wnez7y72hqvuszeyyqt90590gs808qzwq8uj2z6hhr4wrs70vrgmamexx",
    "ckt1qqypm0l63rdt2jayymfrrjnyadmqe630a8skwcdpmfqqmgdje0sjsqt90590gs808qzwq8uj2z6hhr4wrs70vrg7wyejq",
  ]

  const sendNFT = async () => {
    let startIndex = totalSupply
    console.log(` ======> cotaId: ${cotaId}`)
    const mintLock = addressToScript(TEST_ADDRESS)
    console.log(` ======> addressList: ${addressList}`)
    console.log('startIndex: ', startIndex)
    const withdrawals = addressList.map((address, index) => {
      const tokenIndex = padStr((startIndex++).toString(16))
      console.log('tokenIndex: ', tokenIndex)
      return {
        tokenIndex,
        state: '0x00',
        characteristic: '0x0000000000000000000000000000000000000000',
        toLockScript: serializeScript(addressToScript(address)),
      }
    })

    const mintCotaInfo: MintCotaInfo = {
      cotaId,
      withdrawals,
    }
    console.log('mintCotaInfo: ', mintCotaInfo)
    let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo)

    rawTx.cellDeps.push(secp256k1Dep)

    const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
    // console.log('signedTx: ', JSON.stringify(signedTx))
    let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
    console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
  }

  const trElems = addressList.map((address, index) => {
    return (
      <Tr key={address}>
        <Td>
          <Box w='400px'>{address}</Box>
          </Td>
        <Td>Delete</Td>
      </Tr>
    )
  })

  const runnerListElem = runnerResultList && runnerResultList.map((result: any) => {
    return (
      <Box key={result.rule_id}>
        Rule ID: {result.rule_id}
      </Box>
    )
  })

  return (
    <>
      <Sidebar>
        <Heading as='h4' size='md' my='15px'>
          Results
        </Heading>
        <Box>
          {runnerListElem}
        </Box>
        <Heading as='h4' size='md' my='15px'>
          Data
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
