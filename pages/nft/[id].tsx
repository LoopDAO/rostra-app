import { Box, Heading, Image, Text, Stack } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import Loading from "components/Loading/index"
import { GetStaticPaths, GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import { generateFlashsignerAddress, ChainType, Config } from '@nervina-labs/flashsigner'
import { cotaService } from "@lib/utils/ckb"
import { addressToScript, serializeScript, } from '@nervosnetwork/ckb-sdk-utils'

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

export default function NFTDetails() {
  const { query } = useRouter()
  const [nftInfo, setNFTInfo] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const nft = await cotaService.aggregator.getDefineInfo({
        cotaId: query.id || '',
      })
      setNFTInfo(nft)
    };
    fetchData();
  }, [query.id]);

  const { name, description, issued, total, image } = nftInfo
  console.log('nftInfo: ', nftInfo)

  let guildInfoElem

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
      <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
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
