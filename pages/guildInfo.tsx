import React from "react"
import { useTranslation } from "next-i18next"
import { Flex } from "@components/common/Flex"
import { GuildListType } from "../api/guild"
import { Fieldset } from '@components/common/Fieldset'
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Text } from '@components/Text'
import { useRouter } from "next/router"

export default function GuildInfo({ guild }: { guild: GuildListType }) {
  const { t } = useTranslation()
  const nfts = guild?.members?.nfts;
  const guilds = guild?.members?.guilds;
  const router = useRouter()
  const handleClick = (guild: GuildListType) => {
    router.push({
      pathname: '/guildDetails',
      query: { guild: JSON.stringify(guild) }
    })
  }
  
  return (
    <div onClick={() => handleClick(guild)}>
      <Text key={guild?.name}>{guild?.name}</Text>
      <Text css={{ color: "Gray", fontSize: "12px", marginTop: "5px" }} key={guild?.guild_id}>
        {nfts?.length + guilds?.length + " members"}
      </Text>
        <Fieldset css={{ marginTop: "5px" }}>
          {nfts?.map((nft) => (
            <Text 
              css={{ backgroundColor: "Gray", 
              color: "white", 
              border: "3px solid gray", 
              borderRadius: "5px"
            }} key={nft.name}>{nft.name}</Text>
          ))}
          {guilds?.map((memberGuild) => (
            <Text css={{ 
              backgroundColor: "#7be2f9", 
              color: "white",
              border: "3px solid #7be2f9", 
              borderRadius: "5px"
            }} key={memberGuild}>{memberGuild}</Text>
          ))}
        </Fieldset>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
