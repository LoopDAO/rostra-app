import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Stack, Box } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../../components/Layout/Account/AccountFlashsigner"
import {
  addressToScript,
  scriptToHash,
} from '@nervosnetwork/ckb-sdk-utils'
import {
  appendSignatureToTransaction,
  generateFlashsignerAddress,
} from '@nervina-labs/flashsigner'
import { getResultFromURL } from '@nervina-labs/flashsigner'
import { cotaService, ckb, ckbIndexerUrl } from "@lib/utils/ckb"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { hexToBalance } from '@lib/utils/ckb'
import { QRCodeSVG } from "qrcode.react"

export default function CotaRegistryPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)

  const [status, setStatus] = useState(false);
  const script = addressToScript(cotaAddress)
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const res = await cotaService.aggregator.checkReisteredLockHashes([scriptToHash(script)])
        setStatus(res?.registered);
        console.log('res: ', res)
      }
    };
    fetchData();
  }, [cotaAddress, isLoggedIn]);

  const { data } = useSWR(() => [ckbIndexerUrl, script], fetchers.getCellsCapacity)

  const router = useRouter()

  if (!status && router.query.action === 'sign-transaction' || router.query.action === 'sign-message') {
    getResultFromURL(router.asPath, {
      onLogin(res) {
        console.log('onLogin res: ', res)
      },
      async onSignMessage(result) {
        const action = result.extra?.action
        if (action === 'cota-registry') {
          const signedTx = appendSignatureToTransaction(result.extra?.txToSign, result.signature, 1)
          const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
          try {
            await ckb.rpc.sendTransaction(signedTxFormatted as any, 'passthrough')
            console.log('result.extra?.redirect: ', result.extra?.redirect)
            window.location.replace(result.extra?.redirect)
          } catch (error) {
            console.log('error: ', error)
          }
        }
      }
    })
  }

  if (!isLoggedIn) return <AccountFlashsigner />

  const balance = hexToBalance(data?.result?.capacity)

  return (
    <Stack spacing={2} p={4}>
      <Box fontWeight='600'>CoTA Registry Status: {status ? "Registered" : "Not register"}</Box>
      <Box>Address</Box>
      <QRCodeSVG value={cotaAddress} />
      <Box>{cotaAddress}</Box>
      <Box>Balance: {balance}</Box>
    </Stack>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
