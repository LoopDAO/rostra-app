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
    <Flex alignItems="center" justifyContent="center">
      <Box>
        <Image borderRadius="full" boxSize="150px" src={nft.image} alt="nft" onClick={() => handleClick(nft)} />
      </Box>
      <Box>{nft.name}</Box>
    </Flex>
  )
}
