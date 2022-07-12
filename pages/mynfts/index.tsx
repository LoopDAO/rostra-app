import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Box } from "@chakra-ui/react"
import NFTInfo from "@components/nft/NFTInfo"
import { NFTType } from "api/nft"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { generateFlashsignerAddress } from "@nervina-labs/flashsigner"
import { cotaService } from "@lib/utils/ckb"
import { addressToScript, serializeScript } from "@nervosnetwork/ckb-sdk-utils"
import ReactPaginate from "react-paginate"
import AccountFlashsigner from "@components/Layout/Account/AccountFlashsigner"
import Loading from "components/Loading/index"

export default function MyNFTsPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [holdingNFTs, setHoldingNFTs] = useState([])
  const [withdrawableNFTs, setWithdrawableNFTs] = useState([])
  const lockScript = serializeScript(addressToScript(cotaAddress))
  const [pageOffset, setPageOffset] = useState(0)
  const [nftCount, setNFTCount] = useState(0)
  const [pageCount, setPageCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoggedIn) return
        setLoading(true)
        const holds = await cotaService.aggregator.getHoldCotaNft({
          lockScript,
          page: pageOffset,
          pageSize: itemsPerPage,
        })
        if (holds?.nfts) setHoldingNFTs(holds?.nfts as any)

        const withdraws = await cotaService.aggregator.getWithdrawCotaNft({
          lockScript,
          page: pageOffset,
          pageSize: itemsPerPage,
        })
        if (withdraws?.nfts) setWithdrawableNFTs(withdraws.nfts as any)

        const newPageCount = holds.total + withdraws.total
        setNFTCount(newPageCount)
        setPageCount(Math.ceil(newPageCount / itemsPerPage))
      } catch (error: any) {
        console.error(error)
      }
      setLoading(false)
    }
    fetchData()
  }, [pageOffset])

  if (!isLoggedIn) return <AccountFlashsigner />

  const handlePageChange = (event: any) => {
    setPageOffset(event.selected)
  }

  let PaginatedItems = null

  if (pageCount) {
    PaginatedItems = (
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
    )
  }
  let content
  if (loading) {
    content = <Loading />
  }

  if (!loading && nftCount === 0) {
    content = 'No NFT found'
  }

  if (!loading && nftCount) {
    content = (
      <Box>
        <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
          {holdingNFTs.map((nft: NFTType) => (
            <NFTInfo nft={nft} key={nft.cotaId + nft.tokenIndex} />
          ))}
        </Flex>
        <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
          {withdrawableNFTs.map((nft: NFTType) => (
            <NFTInfo nft={nft} key={nft.cotaId + nft.tokenIndex} />
          ))}
        </Flex>
      </Box>
    )
  }
  return (
    <Box>
      <Heading py={5} size="lg">
        {t("nft.myNFTs")}
      </Heading>
      {content}
      {PaginatedItems}
    </Box>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
