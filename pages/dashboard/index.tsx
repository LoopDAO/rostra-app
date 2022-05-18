import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Stack, Box, Button, VStack, Container } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../../components/Layout/Account/AccountFlashsigner"
import {
  addressToScript,
  scriptToHash,
  rawTransactionToHash,
  serializeWitnessArgs,
} from '@nervosnetwork/ckb-sdk-utils'
import {
  generateRegisterCotaTx,
  getAlwaysSuccessLock,
} from '@nervina-labs/cota-sdk'
import {
  signMessageWithRedirect,
  appendSignatureToTransaction,
  Config,
  transactionToMessage,
  generateFlashsignerAddress,
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import { getResultFromURL } from '@nervina-labs/flashsigner'
import { cotaService, ckb, ckbIndexerUrl } from "@lib/utils/ckb"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { hexToBalance } from '@lib/utils/ckb'
import { QRCodeSVG } from "qrcode.react"

const registerCota = async (address: string) => {
  const provideCKBLock = addressToScript(address)
  const unregisteredCotaLock = addressToScript(address)
  const rawTx = await generateRegisterCotaTx(cotaService, [unregisteredCotaLock], provideCKBLock)
  const flashsingerDep = Config.getCellDep()
  rawTx.cellDeps.push(flashsingerDep)

  const registryLock = getAlwaysSuccessLock(false)

  const cells = rawTx.inputs.map((input, index) => ({
    outPoint: input.previousOutput,
    lock: index === 0 ? registryLock : provideCKBLock,
  }))

  const transactionHash = rawTransactionToHash(rawTx)

  const witnesses = {
    transactionHash,
    witnesses: rawTx.witnesses,
    inputCells: cells,
    skipMissingKeys: true,
  }

  const tx: any = paramsFormatter.toRawTransaction({
    ...rawTx,
    witnesses: witnesses.witnesses.map((witness) =>
      typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
    )
  })

  signMessageWithRedirect(
    '/dashboard?sig=',
      {
      isRaw: false,
      message: transactionToMessage(tx, 1),
      extra: {
        txToSign: tx,
        action: 'cota-registry'
      },
    }
  )
}

export default function DashboardPage() {
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
            const txHash = await ckb.rpc.sendTransaction(signedTxFormatted as any, 'passthrough')
            window.location.replace('/dashboard')
          } catch (error) {
            console.log('error: ', error)
          }
        }
      }
    })
  }

  if (!isLoggedIn) return <AccountFlashsigner />

  let registryBtn
  let registryElem
  if(!status) {
    registryBtn = <Button onClick={() => { registerCota(cotaAddress) }}>Register</Button>
  } else {
    registryElem = (
      <Box>
        CKB CoTA Registry: {status?.toString()} {registryBtn}
      </Box>
    )
  }

  const balance = hexToBalance(data?.result?.capacity)

  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("dashboard.title")}</Heading>
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
