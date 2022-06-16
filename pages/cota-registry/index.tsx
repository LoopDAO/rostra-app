import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Stack, Box, Spinner, Center, useToast } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../../components/Layout/Account/AccountFlashsigner"
import { addressToScript, scriptToHash, } from '@nervosnetwork/ckb-sdk-utils'
import { appendSignatureToTransaction, generateFlashsignerAddress, } from '@nervina-labs/flashsigner'
import { getResultFromURL } from '@nervina-labs/flashsigner'
import { cotaService, ckb } from "@lib/utils/ckb"

export default function CotaRegistryPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [registered, setRegistered] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('/')
  const script = addressToScript(cotaAddress)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return

      const res = await cotaService.aggregator.checkReisteredLockHashes([scriptToHash(script)])
      setRegistered(res?.registered)
    }
    const intervalId = setInterval(fetchData, 3000)
    return () => {
      clearInterval(intervalId)
    }
  }, [cotaAddress, isLoggedIn, script]);

  useEffect(() => {
    if (!registered && router.query.action === "sign-message") {
      getResultFromURL(router.asPath, {
        onLogin(res) {
          console.log("onLogin res: ", res)
        },
        async onSignMessage(result) {
          const action = result.extra?.action
          if (action === "cota-registry") {
            const signedTx = appendSignatureToTransaction(result.extra?.txToSign, result.signature, 1)
            const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
            try {
              await ckb.rpc.sendTransaction(signedTxFormatted as any, "passthrough")
              setRedirectUrl(result.extra?.redirect)
            } catch (error: any) {
              toast({
                title: "Error happened.",
                description: error?.message?.message,
                status: "error",
                duration: 10000,
                isClosable: true,
              })
            }
          }
        },
      })
    }
  }, [cotaAddress, isLoggedIn, router.asPath, router.query.action, registered, toast])

  if (!isLoggedIn) return <AccountFlashsigner />

  let content

  if (registered) {
    content = <Box fontWeight="600">{t("cota.registry.confirmed")}</Box>
    router.push(redirectUrl)
  } else {
    content = <Box fontWeight="600">{t("cota.registry.confirming")}</Box>
  }

  return (
    <Center mt={10}>
      <Stack align="center">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        {content}
      </Stack>
    </Center>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
