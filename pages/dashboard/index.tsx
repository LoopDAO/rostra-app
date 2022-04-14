import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Stack, Container, Button } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../../components/Layout/Account/AccountFlashsigner"
import Account from "../../components/Layout/Account"
import {
  addressToScript,
  serializeScript,
  scriptToHash,
  rawTransactionToHash,
  serializeWitnessArgs,
  serializeWitnesses
} from '@nervosnetwork/ckb-sdk-utils'
import {
  generateRegisterCotaTx,
  getAlwaysSuccessLock,
} from '@nervina-labs/cota-sdk'
import {
  signMessageWithRedirect,
  signTransactionWithRedirect,
  appendSignatureToTransaction,
  Config,
  transactionToMessage,
  generateFlashsignerAddress,
  ChainType
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import { getResultFromURL, FlashsignerAction } from '@nervina-labs/flashsigner'
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

const registerCota = async (address: string) => {
  console.log('address: ', address)
  const provideCKBLock = addressToScript(address)
  const unregisteredCotaLock = addressToScript(address)
  const rawTx = await generateRegisterCotaTx(cotaService, [unregisteredCotaLock], provideCKBLock)
  const flashsingerDep = Config.getCellDep()
  console.log('celldep: ', flashsingerDep)
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

  console.log('witnesses', JSON.stringify(witnesses, null, 2))

  const tx: any = paramsFormatter.toRawTransaction({
    ...rawTx,
    witnesses: witnesses.witnesses.map((witness) =>
      typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
    )
  })

  signMessageWithRedirect(
    'http://localhost:3000/dashboard?sig=',
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
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const res = await cotaService.aggregator.checkReisteredLockHashes([
          scriptToHash(addressToScript(cotaAddress)),
        ])
        setStatus(res?.registered);
        console.log('res: ', res)
      }
    };
    fetchData();
  }, [cotaAddress, isLoggedIn]);

  const router = useRouter()
  console.log('router.query: ', router);
  if (!status && router.query.action === 'sign-transaction' || router.query.action === 'sign-message') {
    console.log('router.query.action: ', router.query.action);
    getResultFromURL(router.asPath, {
      onLogin(res) {
        console.log('onLogin res: ', res)
      },
      async onSignMessage(result) {
        const action = result.extra?.action
        console.log(' ====== action: ', action);
        if (action === 'cota-registry') {
          const signedTx = appendSignatureToTransaction(result.extra?.txToSign, result.signature, 1)
          console.log('signedTx: ', signedTx)
          const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
          try {
            const txHash = await ckb.rpc.sendTransaction(signedTxFormatted as any, 'passthrough')
            console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
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
  if(!status) {
    registryBtn = <Button onClick={() => { registerCota(cotaAddress) }}>Register</Button>
  }

  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("dashboard.title")}</Heading>

      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        <Container>Address: {cotaAddress}</Container>
        <Container>CKB CoTA Registry: {status.toString()} {registryBtn}</Container>
      </Flex>

      {/* <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        <Container>ETH Address <Account /></Container>
        <Container>Balance: {'todo'}</Container>
      </Flex> */}
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
