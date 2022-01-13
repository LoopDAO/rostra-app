import React from "react"
import { Fieldset } from '@components/common/Fieldset'
import { Text } from '@components/common/Text'
import { useRouter } from "next/router"

export default function GuildDetails() {
  const { query } = useRouter()
  const guild = JSON.parse(String(query?.guild || '[]'));
  const nfts = guild?.members?.nfts;
  const guilds = guild?.members?.guilds;
  
  return (
    <>
      <Text key={guild?.name}>{guild?.name}</Text>
      <Text css={{ color: "Gray", fontSize: "12px", marginTop: "5px" }} key={guild?.guild_id}>
        {nfts?.length + guilds?.length + " members"}
      </Text>
        <Fieldset css={{ marginTop: "5px" }}>
          {nfts?.map((nft: any) => (
            <Text 
              css={{ backgroundColor: "Gray", 
              color: "white", 
              border: "3px solid gray", 
              borderRadius: "5px"
            }} key={nft.name}>{nft.name}</Text>
          ))}
          {guilds?.map((memberGuild: any) => (
            <Text css={{ 
              backgroundColor: "#7be2f9", 
              color: "white",
              border: "3px solid #7be2f9", 
              borderRadius: "5px"
            }} key={memberGuild}>{memberGuild}</Text>
          ))}
        </Fieldset>
    </>
  )
}