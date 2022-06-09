import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Box } from "@chakra-ui/react"
import NFTInfo from "@components/nft/NFTInfo"
import { NFTType } from "api/nft"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import ReactPaginate from "react-paginate"
import fetchers from "api/fetchers"
import useSWR from "swr"

export default function MyNFTsPage() {
  const { t } = useTranslation()
  const { account } = useAccountFlashsigner()
  const [pageOffset, setPageOffset] = useState(0)
  const [pageCount, setPageCount] = useState(10)
  const itemsPerPage = 20
  const { data: apiNFTs, error } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/mint-nft/account/${account.address}`,
    fetchers.http
  )

  const nftAmount = apiNFTs?.result?.length || 0

  useEffect(() => {
    const fetchData = async () => {
      const newPageCount = nftAmount
      setPageCount(Math.ceil(newPageCount / itemsPerPage))
    }
    fetchData()
  }, [nftAmount, pageOffset])

  const handlePageChange = (event: any) => {
    setPageOffset(event.selected)
  }

  let PaginatedItems

  if (nftAmount > 0) {
    PaginatedItems = (
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
  }

  return (
    <Box>
      <Heading py={5}>{t("nft.manageNFTs")}</Heading>
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {apiNFTs?.result?.map((nft: NFTType) => (
          <NFTInfo nft={nft} key={nft.cotaId + nft.tokenIndex} />
        ))}
      </Flex>

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
