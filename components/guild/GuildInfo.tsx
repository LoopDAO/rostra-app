import React from "react"
import { GuildListType } from "../../api/guild"
import { Fieldset } from "@components/common/Fieldset"
import { Text } from "@components/common/Text"
import { useRouter } from "next/router"
import { Heading } from "@components/common/Heading"
import { Box } from "@components/common/Box"
import { memberStyle } from "./style"

export default function GuildInfo({ guild }: { guild: GuildListType }) {
  const requirements = guild?.requirements
  const members = guild?.members
  const nfts = requirements.nfts
  const guilds = requirements.guilds
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
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "$amberA11",
        },
      }}
      onClick={() => handleClick(guild)}
    >
      <Heading size="2" css={{ color: "$gray1" }}>
        {guild?.name}
      </Heading>
      <Text
        css={{ color: "$gray11", fontSize: "12px", marginTop: "5px" }}
        key={guild?.guild_id}
      >
        {members.length + " members"}
      </Text>
      <Fieldset css={{ marginTop: "5px" }}>
        {nfts?.map((nft) => (
          <Text
            css={memberStyle}
            key={nft.name}
          >
            {nft.name}
          </Text>
        ))}
        {guilds?.map((g) => (
          <Text
            css={memberStyle}
            key={g}
          >
            {g}
          </Text>
        ))}
      </Fieldset>
    </Box>
  )
}
