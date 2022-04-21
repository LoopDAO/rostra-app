import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Box } from "@chakra-ui/react"
import NFTInfo from "@components/nft/NFTInfo"
import { NFTType } from "api/nft"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { generateFlashsignerAddress, ChainType, Config } from "@nervina-labs/flashsigner"
import { cotaService } from "@lib/utils/ckb"
import { addressToScript, serializeScript } from "@nervosnetwork/ckb-sdk-utils"
import ReactPaginate from "react-paginate"
import fetchers, { http } from "api/fetchers"
import useSWR from "swr"

const chainType = process.env.CHAIN_TYPE || "testnet"
Config.setChainType(chainType as ChainType)

export default function MyNFTsPage() {
  const { t } = useTranslation()
  const { account } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [serverApiNFTs, setServerApiNFTs] = useState([])
  const lockScript = serializeScript(addressToScript(cotaAddress))
  const [pageOffset, setPageOffset] = useState(0)
  const [pageCount, setPageCount] = useState(10)
  const itemsPerPage = 10
  const { data: apiNFTs, error } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/mint-nft/account/${account.address}`,
    fetchers.http
  )

  useEffect(() => {
    const fetchData = async () => {
      const serverApiNFTs = apiNFTs?.result || []
      setServerApiNFTs(serverApiNFTs as any)

      const newPageCount = serverApiNFTs.length
      setPageCount(Math.ceil(newPageCount / itemsPerPage))
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

  return (
    <Box>
      <Heading py={5}>{t("nft.manageNFTs")}</Heading>
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {serverApiNFTs?.map((nft: NFTType) => (
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
