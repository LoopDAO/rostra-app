import React, { useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { Web3Provider } from "@ethersproject/providers"
import { Flex, Heading, Stack } from "@chakra-ui/react"
import GuildInfo from "@components/guild/GuildInfo"
import Loading from "@components/Loading"
import { GuildType } from "api/guild"

export default function GuildPage() {
  const { t } = useTranslation()

  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("dashboard.title")}</Heading>

      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        Address:
      </Flex>
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
