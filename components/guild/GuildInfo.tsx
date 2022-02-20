import React from "react"
import { useRouter } from "next/router"
import { GuildType } from "../../api/guild"
import { Heading, Text } from "@chakra-ui/react"
import { chakra, Box, Image, Flex, useColorModeValue } from "@chakra-ui/react"

export default function GuildInfo({ guild }: { guild: GuildType }) {
  const router = useRouter()
  const handleClick = (guild: GuildType) => {
    router.push({
      pathname: `/guild/${guild.guild_id}`,
    })
  }

  // TODO: Add color type
  return (
    <Box
      maxW="xs"
      w="166px"
      h={120}
      bg={useColorModeValue("white", "gray.800")}
      border="1px solid"
      borderColor="gray.300"
      rounded="lg"
      cursor="pointer"
      onClick={() => handleClick(guild)}
    >
      <Box px={4} py={2}>
        <chakra.h1
          color={useColorModeValue("gray.800", "white")}
          fontWeight="bold"
          fontSize="lg"
          textTransform="uppercase"
        >
          {guild?.name}

          {/* <Heading fontSize="xl"></Heading>

<Text fontSize="md">{guild?.desc}</Text> */}
        </chakra.h1>
        <chakra.p
          mt={1}
          fontSize="sm"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          {guild?.desc}
        </chakra.p>
      </Box>
    </Box>
    // <Box
    //   px={3}
    //   py={2}
    //   css={{
    //     border: "2px solid",
    //     borderColor: "gray",
    //     borderRadius: "8px",
    //     cursor: "pointer",
    //     width: "166px",
    //   }}
    // >
    // </Box>
  )
}
