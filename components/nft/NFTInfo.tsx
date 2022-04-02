import React from "react"
import { useRouter } from "next/router"
import { Heading, Text } from "@chakra-ui/react"
import { chakra, Box, Image, Flex, useColorModeValue } from "@chakra-ui/react"
import { NFTType } from "../../api/nft"

export default function NFTInfo({ nft }: { nft: NFTType }) {
  const router = useRouter()
  const handleClick = (nft: NFTType) => {
    router.push({
      pathname: `/mynfts/${nft.cota_id}`,
    })
  }

  return <Image borderRadius="full" boxSize="150px" src={nft.image} alt="nft" onClick={() => handleClick(nft)} />
}
