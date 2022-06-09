import React from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../../components/Layout/Account/AccountFlashsigner"
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { generateFlashsignerAddress } from "@nervina-labs/flashsigner"
import { ckbIndexerUrl, hexToBalance } from "@lib/utils/ckb"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { QRCodeSVG } from "qrcode.react"
import { Box, Center, Text, Stack } from "@chakra-ui/react"
import CopyableAddress from "@components/Layout/Account/CopyableAddress"

export default function DashboardPage() {
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const script = addressToScript(cotaAddress)
  const { data } = useSWR(() => [ckbIndexerUrl, script], fetchers.getCellsCapacity)
  const balance = hexToBalance(data?.result?.capacity)

  if (!isLoggedIn) return <AccountFlashsigner />

  return (
    <Stack spacing={2} p={4}>
      <Center py={12}>
        <Box
          role={"group"}
          py={6}
          maxW={"330px"}
          w={"full"}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
        >
          <Box
            rounded={"lg"}
            pos={"relative"}
          >
            <QRCodeSVG value={cotaAddress} />
          </Box>
          <Stack pt={10} align={"center"}>
            <Text color={"gray.500"} fontSize={"sm"}>
              <CopyableAddress address={cotaAddress} decimals={4} />
            </Text>
            <Stack direction={"row"} align={"center"}>
              <Text>
                {balance} CKB
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Center>
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
