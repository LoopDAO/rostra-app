import { Box, Heading, Image, Text, Stack, Flex } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import Loading from "components/Loading/index"
import { GetStaticPaths, GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import { generateFlashsignerAddress, ChainType, Config } from '@nervina-labs/flashsigner'
import { cotaService } from "@lib/utils/ckb"
import { addressToScript, serializeScript, } from '@nervosnetwork/ckb-sdk-utils'
import NFTInfo from "@components/nft/NFTInfo"
import { NFTType } from "api/nft"
import ReactPaginate from 'react-paginate';
import { useTranslation } from "next-i18next"

export default function NFTDetails() {
  const { t } = useTranslation()
  const { query } = useRouter()
  const [nftInfo, setNFTInfo] = useState({})
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [pageOffset, setPageOffset] = useState(0);
  const [pageCount, setPageCount] = useState(10);
  const itemsPerPage = 10
  const { isLoggedIn, account } = useAccountFlashsigner()

  const cotaId = query.id || ''
  const { name, description, issued, total, image } = nftInfo
  console.log('nftInfo: ', nftInfo)

  useEffect(() => {
    const fetchData = async () => {
      const nft = await cotaService.aggregator.getDefineInfo({
        cotaId,
      })
      setNFTInfo(nft)
    };
    fetchData();
  }, [cotaId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return
      const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
      const lockScript = serializeScript(addressToScript(cotaAddress))

      const mints = await cotaService.aggregator.getMintCotaNft({
        lockScript,
        page: pageOffset,
        pageSize: itemsPerPage,
      })
      console.log('aaa mints: ', mints)
      const thisMints = mints.nfts.filter(nft => nft.cotaId === cotaId)
      setMintedNFTs(thisMints as any)

      const newPageCount = thisMints.length
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
    <Stack pt={10} align={'center'}>
      <Box>
        <Image
          height={230}
          width={282}
          objectFit={'cover'}
          src={image}
          alt={name}
        />
      </Box>
      <Heading fontSize={'2xl'} fontWeight={500}>
        {name}
      </Heading>
      <Text color={'gray.500'}>
        {description}
      </Text>
      <Stack direction={'column'} align={'center'}>
        <Text>
          {issued} issued / {total} total
        </Text>
        <Text>
          {query.id}
        </Text>
      </Stack>
      <Stack direction={'column'} align={'center'} py={12}>
        <Heading fontSize={'2xl'} fontWeight={500}>
          {t('nft.myNFTs')}
        </Heading>
        <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
          {mintedNFTs.map((nft: NFTType) => <NFTInfo nft={nft} key={cotaId + nft.tokenIndex} />)}
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}
