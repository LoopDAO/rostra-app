import React from "react"
import { useRouter } from "next/router"
import { Box, Image, Flex } from "@chakra-ui/react"
import { NFTType } from "../../api/nft"

export default function NFTInfo({ nft }: { nft: NFTType }) {
  const router = useRouter()
  const handleClick = (nft: NFTType) => {
    router.push({
      pathname: `/mynfts/${nft.cotaId}`,
    })
  }

  console.log('nft; ', nft)

  return (
    <Flex alignItems="flex-start">
      <Box>
        <Image boxSize="150px" src={nft.image} alt="nft" onClick={() => handleClick(nft)} />
      </Box>
      <Box>{nft.name}</Box>
      <Box>{nft.cotaId}</Box>
    </Flex>
  )
}
0x6d18f5caf638139bed31636ade45e3f6004fff40