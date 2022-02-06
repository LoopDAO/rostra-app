import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { Flex } from "@components/common/Flex"
import { Box } from "@components/common/Box"
import { Heading } from "@components/common/Heading"
import GuildInfo from "@components/guild/GuildInfo"
import { Checkbox, CheckboxIndicator } from "@components/common/Checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import { Label } from "@components/common/Label"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Fieldset } from "@components/common/Fieldset"
import useSWR from "swr"
import { fetcher } from "api/http"
import { Web3Provider } from "@ethersproject/providers"

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
    fetcher
  )
  const guildsList = guildsData?.guilds

  const {
    data: userGuildsData,
    error: userGuildsError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      account
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/${account}`
        : null,
    fetcher
  )

  if (guildsError || userGuildsError)
    return <div>{guildsError?.message || userGuildsError?.message}</div>

  if (isLoadingGuildData || isLoadingUserGuilds) return <div>Loading...</div>

  return (
    <>
      <Box css={{ marginLeft: "20px", font: "12px/1.5 'PT Sans', serif" }}>
        <Flex>
          <Heading>{t("guild.list")}</Heading>
          <Fieldset>
            <Checkbox
              defaultChecked
              id="c1"
              checked={checked}
              onCheckedChange={() => setChecked(!checked)}
            >
              <CheckboxIndicator>
                <CheckIcon />
              </CheckboxIndicator>
            </Checkbox>
            <Label htmlFor="c1">{t("guild.guilds")}</Label>
          </Fieldset>
        </Flex>
        <Flex css={{ marginTop: "$4", flexWrap: 'wrap', gap: "$4" }}>
          {guildsList &&
            guildsList?.map((guild) => (
              <Box key={guild.id}>
                <GuildInfo guild={guild} />
              </Box>
            ))}
        </Flex>
      </Box>
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
