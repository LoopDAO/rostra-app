import React from "react"
import { GuildListType } from "../../api/guild"
import { Fieldset } from "@components/common/Fieldset"
import { Text } from "@components/common/Text"
import { useRouter } from "next/router"
import { Heading } from "@components/common/Heading"
import { Box } from "@components/common/Box"

export default function GuildInfo({ guild }: { guild: GuildListType }) {
  const nfts = guild?.nfts
  const members = guild?.members
  const router = useRouter()
  const handleClick = (guild: GuildListType) => {
    router.push({
      pathname: `/guild/${guild.guild_id}`,
    })
  }

  // TODO: Add color type
  return (
    <Box
      css={{
        px: "$4",
        py: "$3",
        backgroundColor: "$amberA10",
        borderRadius: "$4",
      }}
      onClick={() => handleClick(guild)}
    >
      <Heading size="2" css={{ color: "$gray12" }}>
        {guild?.name}
      </Heading>
      <Text
        css={{ color: "Gray", fontSize: "12px", marginTop: "5px" }}
        key={guild?.guild_id}
      >
        {members?.length + " members"}
      </Text>
      <Fieldset css={{ marginTop: "5px" }}>
        {nfts?.map((nft) => (
          <Text
            css={{
              backgroundColor: "Gray",
              color: "white",
              border: "3px solid gray",
              borderRadius: "5px",
            }}
            key={nft.name}
          >
            {nft.name}
          </Text>
        ))}
        {members?.map((memberGuild) => (
          <Text
            css={{
              backgroundColor: "#7be2f9",
              color: "white",
              border: "3px solid #7be2f9",
              borderRadius: "5px",
            }}
            key={memberGuild}
          >
            {memberGuild}
          </Text>
        ))}
      </Fieldset>
    </Box>
  )
}
