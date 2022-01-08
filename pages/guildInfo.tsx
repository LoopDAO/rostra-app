import React from "react"
import { useTranslation } from "next-i18next"
import { Flex } from "@components/Flex"
import { GuildListType } from "../api/guild"
import { Fieldset } from '@components/Fieldset'
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Text } from '@components/Text'

export default function GuildInfo({ guild }: { guild: GuildListType }) {
  const { t } = useTranslation()

  return (
    <>
      <p key={guild?.name}>{guild?.name}</p>
      <Text key={guild?.guild_id}>
        {guild?.members.nfts.length + guild?.members.guilds.length + " members"}
      </Text>
        <Fieldset css={{ gap: 10  }}>
          {guild?.members.nfts?.map((nft) => (
            <p key={nft.name}>{nft.name}</p>
          ))}
          {guild?.members.guilds?.map((memberGuild) => (
            <p key={memberGuild}>{memberGuild}</p>
          ))}
        </Fieldset>
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
