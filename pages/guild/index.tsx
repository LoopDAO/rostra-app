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
  const { account } = useWeb3React<Web3Provider>()
  const [checked, setChecked] = useState(false)

  const {
    data: guildsData,
    error: guildsError,
    isValidating: isLoadingGuildData,
  } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/`,
    fetchers.http
  )

  const {
    data: userGuildsData,
    error: userGuildsError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      account
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/${account}`
        : null,
    fetchers.http
  )

  const guildsList = checked ? userGuildsData?.result : guildsData?.result

  if (guildsError || userGuildsError)
    return <div>{guildsError?.message || userGuildsError?.message}</div>

  if (isLoadingGuildData || isLoadingUserGuilds) return <Loading />

  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("guild.list")}</Heading>

      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {guildsList &&
          guildsList?.map((guild: GuildType) => (
            <GuildInfo guild={guild} key={guild.guild_id} />
          ))}
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
