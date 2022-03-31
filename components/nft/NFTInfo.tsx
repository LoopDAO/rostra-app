import React from "react"
import { useRouter } from "next/router"
import { Heading, Text } from "@chakra-ui/react"
import { chakra, Box, Image, Flex, useColorModeValue } from "@chakra-ui/react"
import { NFTType } from "../../api/nft"

export default function NFTInfo({ guild }: { guild: NFTType }) {
  const router = useRouter()
  const handleClick = (nft: NFTType) => {
    router.push({
      pathname: `/mynfts/${nft.guild_id}`,
    })
  }

  // TODO: Add color type
  return (

    <Image
      borderRadius='full'
      boxSize='150px'
      src='/image/nft/nft219.png'
      alt='nft'
      onClick={() => handleClick(guild)}
    />

  )
}
