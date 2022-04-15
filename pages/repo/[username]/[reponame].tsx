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
  const { query, asPath } = useRouter()
  console.log('query: ', query)
  const { username, reponame } = query;
  console.log("username: ", username)
  console.log("reponame: ", reponame)

  const {
    data: runnerResultListData,
    error: runnerResultListError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      account.address
        ? `${process.env.NEXT_PUBLIC_API_BASE}/github/getcommits/${username}/${reponame}`
        : null,
    fetchers.http
  )

  const { result: runnerResultList } = runnerResultListData || {}

  console.log('runnerResultList: ', runnerResultList)
  const mintNFT = async () => {
    let startIndex = totalSupply
    const mintLock = addressToScript(cotaAddress)
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

    const tx: any = paramsFormatter.toRawTransaction({
      ...rawTx,
      witnesses: rawTx.witnesses.map((witness) =>
        typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
      )
    })

    signMessageWithRedirect(
      'http://localhost:3000/report?sig=',
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

  if (query.action === 'sign-transaction' || query.action === 'sign-message') {
    console.log('query.action: ', query.action);
    getResultFromURL(asPath, {
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

  return (
    <>
      <Heading as='h4' size='md' my='15px'>
        Commits
      </Heading>
      {
        runnerResultList?.map((result: any) => {
          return (
            <Box key={result.sha} my={8}>
              <Box>{result.author}</Box>
              {/* <Box>{new Date(result.date)}</Box> */}
              <Box>{result.email}</Box>
              <Box>{result.message}</Box>
              <Box>{result.sha}</Box>
            </Box>
          )
        })
      }
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


export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}