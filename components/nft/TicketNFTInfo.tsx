import { Image } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import { cotaNFTType } from "../../api/nft"

export default function TicketNFTInfo({ nft }: { nft: cotaNFTType }) {
  const router = useRouter()
  const handleClick = (nft: cotaNFTType) => {
    router.push({
      pathname: `/mynfts/${nft.cota_id}`,
    })
  }
  console.log("nft", nft)
  // TODO: Add color type
  return <Image borderRadius="full" boxSize="150px" src={nft.image} alt="nft" onClick={() => handleClick(nft)} />
}
