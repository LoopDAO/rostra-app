import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Box } from "@chakra-ui/react"
import NFTInfo from "@components/nft/NFTInfo"
import { NFTType } from "api/nft"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { generateFlashsignerAddress, ChainType, Config } from '@nervina-labs/flashsigner'
import { cotaService } from "@lib/utils/ckb"
import { addressToScript, serializeScript, } from '@nervosnetwork/ckb-sdk-utils'
import ReactPaginate from 'react-paginate';

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

export default function MyNFTsPage() {
  const { t } = useTranslation()
  const { account } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [holdingNFTs, setHoldingNFTs] = useState([])
  const [withdrawableNFTs, setWithdrawableNFTs] = useState([])
  const lockScript = serializeScript(addressToScript(cotaAddress))
  const [pageOffset, setPageOffset] = useState(0);
  const [pageCount, setPageCount] = useState(10);
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      const holds = await cotaService.aggregator.getHoldCotaNft({
        lockScript,
        page: pageOffset,
        pageSize: itemsPerPage,
      })
      console.log('aaa holds: ', holds)
      setHoldingNFTs(holds.nfts as any)
      const withdraws = await cotaService.aggregator.getWithdrawCotaNft({
        lockScript,
        page: pageOffset,
        pageSize: itemsPerPage,
      })
      console.log('aaa withdraws: ', withdraws)

      setWithdrawableNFTs(withdraws.nfts as any)
      const newPageCount = holds.total + withdraws.total
      console.log('newPageCount: ', newPageCount)
      setPageCount(Math.ceil(newPageCount / itemsPerPage))
    }
    fetchData();

  }, [pageOffset]);

  const handlePageChange = (event) => {
    console.log(event);
    // when its content is loaded in useEffect.
    setPageOffset(event.selected);
  };

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
  );

  return (
    <Box>
      <Heading py={5}>{t("nft.myNFTs")}</Heading>
      {PaginatedItems}
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {holdingNFTs.map((nft: NFTType) => <NFTInfo nft={nft} key={nft.cotaId + nft.tokenIndex} />)}
      </Flex>
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {withdrawableNFTs.map((nft: NFTType) => <NFTInfo nft={nft} key={nft.cotaId + nft.tokenIndex} />)}
      </Flex>
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
