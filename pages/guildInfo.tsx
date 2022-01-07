import React from 'react';
import { useTranslation } from "next-i18next"
import { GuildListType } from "../api/guild"
import { Flex } from '@components/Flex';


export default function GuildInfo({ guild }: { guild: GuildListType }) {
  const { t } = useTranslation();
  let { nfts, guilds } = guild.members;

  return (
    <>
      <p key={guild.name}>{guild.name}</p>
      <p key={guild.guild_id}>{nfts.length + guilds.length + " members"}</p>
      <Flex>
        {nfts?.map((nft) => (
          <p key={nft.name}>{nft.name}</p>
        ))}
        {guilds?.map((memberGuild) => (
          <p key={memberGuild}>{memberGuild}</p>
        ))}
      </Flex>
    </>
  );
}