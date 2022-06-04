import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Heading, Stack, Box } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../../components/Layout/Account/AccountFlashsigner"
import { addressToScript, scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { generateFlashsignerAddress } from "@nervina-labs/flashsigner"
import { cotaService, ckbIndexerUrl, hexToBalance } from "@lib/utils/ckb"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { QRCodeSVG } from "qrcode.react"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const script = addressToScript(cotaAddress)
  const { data } = useSWR(() => [ckbIndexerUrl, script], fetchers.getCellsCapacity)
  const balance = hexToBalance(data?.result?.capacity)

  if (!isLoggedIn) return <AccountFlashsigner />

  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("dashboard.title")}</Heading>
      <Box>Address</Box>
      <QRCodeSVG value={cotaAddress} />
      <Box>{cotaAddress}</Box>
      <Box>Balance: {balance} CKB</Box>
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
