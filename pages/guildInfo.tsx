import React from "react"
import { useTranslation } from "next-i18next"
import { Flex } from "@components/Flex"
import { GuildListType } from "../api/guild"

export default function GuildInfo({ guild }: { guild: GuildListType }) {
  const { t } = useTranslation()

  return (
    <>
      <p key={guild?.name}>{guild?.name}</p>
      <p key={guild?.guild_id}>
        {guild?.members.nfts.length + guild?.members.guilds.length + " members"}
      </p>
      <Flex>
        {guild?.members.nfts?.map((nft) => (
          <p key={nft.name}>{nft.name}</p>
        ))}
        {guild?.members.guilds?.map((memberGuild) => (
          <p key={memberGuild}>{memberGuild}</p>
        ))}
      </Flex>
    </>
  )
}
