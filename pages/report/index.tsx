import React, { useEffect } from "react"
import { useRouter } from 'next/router'
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
  Image
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Sidebar from "@components/Layout/Sidebar"
import { generateMintCotaTx, MintCotaInfo, } from '@nervina-labs/cota-sdk'
import { padStr, cotaService, ckb } from "@lib/utils/ckb"
import fetchers from "api/fetchers"
import httpPost from 'api/post'
import useSWR from 'swr'
import {
  addressToScript,
  serializeScript,
  serializeWitnessArgs,
} from '@nervosnetwork/ckb-sdk-utils'
import {
  signMessageWithRedirect,
  appendSignatureToTransaction,
  Config,
  transactionToMessage,
  generateFlashsignerAddress,
  ChainType
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import { getResultFromURL } from '@nervina-labs/flashsigner'
import cookie from 'react-cookies'

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

export default function ReportingPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [totalSupply, setTotalSupply] = React.useState(0)
  const [runnerId, setRunnerId] = React.useState('')
  const [ruleId, setRuleId] = React.useState('')
  const [addressList, setAddressList] = React.useState([])
  const [currentRunner, setCurrentRunner] = React.useState<any>()
  const [nftInfo, setNftInfo] = React.useState<any>()

  const {
    data: runnerResultListData,
    error: runnerResultListError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      account.address
        ? `${process.env.NEXT_PUBLIC_API_BASE}/result/get/walletaddr/${account.address}`
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
    setNftInfo(nftInfo)
    setTotalSupply(nftInfo?.issued)
  }

  const getResultAddressList = async (id: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/address_list/result_id/${id}?page=1&per_page=20`
    const res = await fetchers.http(url)
    setAddressList(res)
  }

  const getRunnerInfo = async (id: string) => {
    const res = await fetchers.http(`${process.env.NEXT_PUBLIC_API_BASE}/rule/${id}`)
    setCurrentRunner(res?.result)
    return res?.result
  }
  function isOnTime(timestamp: number) {
    const now = Date.now()
    const diff = now - timestamp
    return diff < 5*60*1000
  }
  async function postDelete2Rostra(ruleId: string, address: string,
    signature: string, timestamp: number) {
    const url = `/result/delete`
    const data = {
      rule_id:ruleId,
      address,signature,timestamp
    }
    await httpPost(url, data)
  }
  const deleteResult = async (address: string) => {
    const timestamp = cookie.load('timestamp')
    const signature = cookie.load('signature')
    if (signature?.length&&timestamp&&isOnTime(timestamp)) {
      postDelete2Rostra(ruleId, address, signature, timestamp)
      await getResultAddressList(runnerId)
    } else {
      const timestamp = Date.now()
      cookie.save('timestamp', timestamp, { path: '/' })
      signMessageWithRedirect(`${window.location.origin}/report`, {
        isRaw: true,
        message: timestamp.toString(),
        extra: {
          action: "report",
          ruleId: ruleId,
          address: address
        },
      })
    }
  }

  const mintNFT = async () => {
    let startIndex = totalSupply
    const mintLock = addressToScript(cotaAddress)
    const withdrawals = addressList.map((address, index) => {
      const tokenIndex = padStr((startIndex++).toString(16))
      return {
        tokenIndex,
        state: '0x00',
        characteristic: '0x0000000000000000000000000000000000000000',
        toLockScript: serializeScript(addressToScript('ckb1qpth5hjexr3wehtzqpm97dzzucgemjv7sl05wnez7y72hqvuszeyyqt90590gs808qzwq8uj2z6hhr4wrs70vrg40skv7')),
      }
    })

    const mintCotaInfo: MintCotaInfo = {
      cotaId: currentRunner?.nft,
      withdrawals,
    }
    let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo)

    const tx: any = paramsFormatter.toRawTransaction({
      ...rawTx,
      witnesses: rawTx.witnesses.map((witness) =>
        typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
      )
    })

    signMessageWithRedirect(
      '/report?sig=',
      {
        isRaw: false,
        message: transactionToMessage(tx as any),
        extra: {
          txToSign: tx,
          action: 'mint-nft'
        },
      }
    )
  }

  const router = useRouter()
  console.log('router.query: ', router);
  if (router.query.action === 'sign-transaction' || router.query.action === 'sign-message' ) {
    console.log('router.query.action: ', router.query.action);
    getResultFromURL(router.asPath, {
      onLogin(res) {
        console.log('onLogin res: ', res)
      },
      async onSignMessage(result) {
        const action = result.extra?.action
        console.log(' ====== action: ', action);

        if (action === 'mint-nft') {
          const signedTx = appendSignatureToTransaction(result.extra?.txToSign, result.signature)
          console.log('signedTx: ', signedTx)
          const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
          try {
            const txHash = await ckb.rpc.sendTransaction(signedTxFormatted as any, 'passthrough')
            console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
            window.location.replace('/report')
          } catch (error) {
            console.log('error: ', error)
          }
        }
      }
    })
  }
  if (router.query.action === 'sign-raw-message') {
    console.log('router.query.action: ', router.query.action);
    getResultFromURL(router.asPath, {
      onLogin(res) {
        console.log('onLogin res: ', res)
      },
      async onSignRawMessage(result) {
        const action = result.extra?.action
        console.log(' ====== action: ', action);
        if(action === 'report'){
          cookie.save("signature", result.signature, { path: "/" })
          console.log('report signedMessage: ', result)
          const address = result.extra?.address
          const ruleId = result.extra?.ruleId
          //postDelete2Rostra(result.extra?.ruleId, result.extra?.address)
          //report?action=sign-raw-message
          window.location.replace('/report?action=post-delete-rostra&address='+address+'&ruleId='+ruleId)
        }
      }
    })
  }
  if (router.query.action === 'post-delete-rostra') {
    console.log('router.query.action: ', router.query.action)
      const addr = router.query.address as string
      console.log(' ====== action: ', router.query)
    const ruleId = router.query.ruleId as string

    const timestamp = cookie.load('timestamp')
    const signature = cookie.load('signature')
    postDelete2Rostra(ruleId, addr, signature, timestamp)

    window.location.replace('/report')
  }

  if (router.query.action === 'post-delete-rostra') {
    console.log('router.query.action: ', router.query.action)

  }

  const trElems = addressList?.length&&addressList?.map((address, index) => {
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
          runnerResultList?.length>0&& runnerResultList?.map((result: any) => {
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

  let resultInfoElem = (
    <Box>
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
      <Box>Name: {nftInfo?.name}</Box>
      <Box>Description: {nftInfo?.description}</Box>
      <Box>Total Supply: {nftInfo?.total}</Box>
      <Box>Issued: {totalSupply}</Box>
      <Box><Image boxSize="150px" src={nftInfo?.image} alt="nft" /></Box>
      <Button
        mt={4}
        colorScheme="teal"
        onClick={mintNFT}
      >
        Send NFT
      </Button>
    </Box>
  )

  if (!currentRunner) {
    resultInfoElem = <></>
  }

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
        {resultInfoElem}
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
