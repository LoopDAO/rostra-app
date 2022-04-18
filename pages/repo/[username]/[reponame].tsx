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

interface Commit {
    message: string;
    sha: string;
    author: string;
    email: string;
    date: string;
    login?: string;
    PublicKey?: string;
}

export default function ReportingPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [issued, setIssued] = React.useState(0)
  const [runnerId, setRunnerId] = React.useState('')
  const [ruleId, setRuleId] = React.useState('')
  const [addressList, setAddressList] = React.useState([])
  const [currentRunner, setCurrentRunner] = React.useState<any>()
  const [nftInfo, setNftInfo] = React.useState<any>()
  const router = useRouter()
  const { query, asPath } = router
  console.log('router: ', router)
  console.log('query: ', query)
  const { username, reponame, pathname } = query;
  console.log("username: ", username)
  console.log("reponame: ", reponame)
  // todo
  const cotaId = '0x9f4c9bbb5a56a5dfe9c95776ed334751f872c01d'

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

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const aggregator = cotaService.aggregator
        const nftInfo = await aggregator.getDefineInfo({
          cotaId,
        })
        setIssued(nftInfo?.issued)
      }
    }
    fetchData()
  }, [cotaAddress, isLoggedIn])

  const { result: commits } = runnerResultListData || {}

  console.log('commits: ', commits)
  const mintNFT = async (commit: Commit) => {
    console.log('commit: ', commit)
    let startIndex = issued
    const mintLock = addressToScript(cotaAddress)
    const tokenIndex = padStr((startIndex++).toString(16))
    const withdrawalInfo = {
      tokenIndex,
      state: '0x00',
      characteristic: `0x${commit.sha}`,
      toLockScript: serializeScript(addressToScript(cotaAddress)),  // todo: use user's address
    }

    const mintCotaInfo: MintCotaInfo = {
      cotaId,
      withdrawals: [withdrawalInfo],
    }
    console.log('mintCotaInfo: ', mintCotaInfo)

    let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo)

    const tx: any = paramsFormatter.toRawTransaction({
      ...rawTx,
      witnesses: rawTx.witnesses.map((witness) =>
        typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
      )
    })
    console.log('asPath: ', asPath)
    signMessageWithRedirect(
      `${asPath}?sig=`,
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
          } catch (error) {
            console.log('error: ', error)
          } finally {
            window.location.replace(asPath.split('?')[0])
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
        commits?.map((result: any) => {
          return (
            <Box key={result.sha} my={8}>
              <Box>{result.author}</Box>
              {/* <Box>{new Date(result.date)}</Box> */}
              <Box>{result.email}</Box>
              <Box>{result.message}</Box>
              <Box>{result.sha}</Box>
              {/* <Link href={`repo/${username}/${reponame}/commit/${result.sha}`}> */}
              <Button
                mt={4}
                colorScheme="teal"
                onClick={() => mintNFT(result)}
              >
                Send NFT
              </Button>

              <Button
                mt={4}
                colorScheme="teal"
                onClick={() => mintNFT(result)}
              >
                Tip DAI
              </Button>

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