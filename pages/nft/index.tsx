import { Box, Heading, Image, Text, Stack, Flex, Button } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import Loading from "components/Loading/index"
import { GetStaticPaths, GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import { generateFlashsignerAddress, ChainType, Config } from "@nervina-labs/flashsigner"
import { cotaService } from "@lib/utils/ckb"
import { addressToScript, serializeScript } from "@nervosnetwork/ckb-sdk-utils"
import NFTInfo from "@components/nft/NFTInfo"
import { NFTType } from "api/nft"
import ReactPaginate from "react-paginate"
import { useTranslation } from "next-i18next"
import Link from "next/link"

export default function NFTDetails() {
  const { t } = useTranslation()
  const { query } = useRouter()
  const [nftInfo, setNFTInfo] = useState({})
  const [holdingNFTs, setHoldingNFTs] = useState([])
  const [withdrawnNFTs, setWithdrawnNFTs] = useState([])
  const [pageOffset, setPageOffset] = useState(0)
  const [pageCount, setPageCount] = useState(10)
  const itemsPerPage = 10
  const { isLoggedIn, account } = useAccountFlashsigner()

  const cotaId: string = (query.cotaId as string) || ""
  const { name, description, issued, total, image } = nftInfo as any
  console.log("nftInfo: ", nftInfo)

  useEffect(() => {
    const fetchData = async () => {
      if (!cotaId) return
      const nft = await cotaService.aggregator.getDefineInfo({
        cotaId,
      })
      if (nft) setNFTInfo(nft)
    }
    fetchData()
  }, [cotaId])

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return
      const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
      const lockScript = serializeScript(addressToScript(cotaAddress))

      try {
        const holds = await cotaService.aggregator.getHoldCotaNft({
          lockScript,
          page: pageOffset,
          pageSize: itemsPerPage,
        })
        console.log("aaa holds: ", holds)

        const thisHoldings = holds.nfts.filter((nft) => nft.cotaId === cotaId)
        setHoldingNFTs(thisHoldings as any)

        const withdraws = await cotaService.aggregator.getWithdrawCotaNft({
          lockScript,
          page: pageOffset,
          pageSize: itemsPerPage,
        })
        console.log("aaa withdraws: ", withdraws)
        const thisWithdrawss = withdraws.nfts.filter((nft) => nft.cotaId === cotaId)
        setWithdrawnNFTs(thisWithdrawss as any)

        const newPageCount = thisHoldings.length + thisWithdrawss.length
        console.log("newPageCount: ", newPageCount)
        setPageCount(Math.ceil(newPageCount / itemsPerPage))
      } catch (error) {
        console.log("error: ", error)
      }
    }
    fetchData()
  }, [pageOffset])

  const handlePageChange = (event: any) => {
    console.log(event)
    // when its content is loaded in useEffect.
    setPageOffset(event.selected)
  }

  const PaginatedItems = (
    <>
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
        forcePage={pageOffset}
      />
    </>
  )

  if (!cotaId) return <Loading />

  return (
    <Stack pt={10} align={"center"}>
      <Box>
        <Image height={230} objectFit={"cover"} src={image} alt={name} />
      </Box>
      <Heading fontSize={"2xl"} fontWeight={500}>
        {name}
      </Heading>
      <Text color={"gray.500"}>{description}</Text>
      <Stack direction={"column"} align={"center"}>
        <Text>
          {issued} issued / {total} total
        </Text>
        <Text>{cotaId}</Text>
        <Link href={`/nft/${cotaId}/mint`} passHref>
          <Button
            colorScheme={"green"}
            bg={"green.400"}
            rounded={"full"}
            px={6}
            _hover={{
              bg: "green.500",
            }}
          >
            {t("nft.mint")}
          </Button>
        </Link>
      </Stack>
      <Stack direction={"column"} align={"center"} py={12}>
        <Heading fontSize={"2xl"} fontWeight={500}>
          {t("nft.myNFTs")}
        </Heading>
        <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
          {holdingNFTs.map((nft: NFTType) => (
            <NFTInfo nft={nft} key={cotaId + nft.tokenIndex} />
          ))}
        </Flex>
        <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
          {withdrawnNFTs.map((nft: NFTType) => (
            <NFTInfo nft={nft} key={cotaId + nft.tokenIndex} />
          ))}
        </Flex>
        {PaginatedItems}
      </Stack>
    </Stack>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: true,
//   }
// }
