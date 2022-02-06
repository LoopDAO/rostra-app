import React from "react"
import { GuildType } from "../../api/guild"
import { useRouter } from "next/router"
import { Heading } from "@components/common/Heading"
import { Box } from "@components/common/Box"

export default function GuildInfo({ guild }: { guild: GuildType }) {
  const router = useRouter()
  const handleClick = (guild: GuildType) => {
    router.push({
      pathname: `/guild/${guild.guild_id}`,
    })
  }

  console.log('guild info', guild)
  // TODO: Add color type
  return (
    <Box
      css={{
        px: "$4",
        py: "$3",
        border: "2px solid",
        borderColor: '$gray11',
        borderRadius: "8px",
        cursor: "pointer",
        width: "166px"
      }}
      onClick={() => handleClick(guild)}
    >
      <Heading size="2">{guild?.name}</Heading>
      <Heading size="1" css={{ color: '$grayA10'}}>{guild?.desc}</Heading>
    </Box>
  )
}
