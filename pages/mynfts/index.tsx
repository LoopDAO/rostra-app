import React, { useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { Web3Provider } from "@ethersproject/providers"
import { Flex, Heading, Stack, Text, Box } from "@chakra-ui/react"
import NFTInfo from "@components/nft/NFTInfo"
import Loading from "@components/Loading"
import { GuildType } from "api/guild"

export default function MyNFTsPage() {
  const { t } = useTranslation()
  const { account } = useWeb3React<Web3Provider>()
  const [checked, setChecked] = useState(false)

  const {
    data: itemsData,
    error: itemsError,
    isValidating: isLoadingData,
  } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/`,
    fetchers.http
  )

  const {
    data: userItemsData,
    error: userItemsError,
    isValidating: isLoadingUserItems,
  } = useSWR(
    () =>
      account
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/${account}`
        : null,
    fetchers.http
  )

  const itemList = checked ? userItemsData?.result : itemsData?.result

  if (itemsError || userItemsError)
    return <div>{itemsError?.message || userItemsError?.message}</div>

  if (isLoadingData || isLoadingUserItems) return <Loading />



  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("nft.myNFTs")}</Heading>
      <Text>Membership</Text>
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {itemList &&
          itemList?.map((guild: GuildType) => (
            <NFTInfo guild={guild} key={guild.guild_id} />
          ))}
      </Flex>
      <Text>Tickets</Text>
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {itemList &&
          itemList?.map((guild: GuildType) => (
            <NFTInfo guild={guild} key={guild.guild_id} />
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
