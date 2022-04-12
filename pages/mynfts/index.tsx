import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Stack, Text, Box } from "@chakra-ui/react"
import NFTInfo from "@components/nft/NFTInfo"
import { NFTType } from "api/nft"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import {
  generateFlashsignerAddress,
  ChainType,
  Config
} from '@nervina-labs/flashsigner'
import { cotaService } from "@lib/utils/ckb"
import {
  addressToScript,
  serializeScript,
} from '@nervosnetwork/ckb-sdk-utils'

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

export default function MyNFTsPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [holdingNFTs, setHoldingNFTs] = useState([])
  const [withdrawableNFTs, setWithdrawableNFTs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const lockScript = serializeScript(addressToScript(cotaAddress))
        const holds = await cotaService.aggregator.getHoldCotaNft({
          lockScript,
          page: 0,
          pageSize: 10,
        })
        setHoldingNFTs(holds.nfts as any)

        const withdraws = await cotaService.aggregator.getWithdrawCotaNft({
          lockScript,
          page: 0,
          pageSize: 10,
        })
        setWithdrawableNFTs(withdraws.nfts as any)
      }
    };
    fetchData();
  }, [cotaAddress, isLoggedIn]);

  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("nft.myNFTs")}</Heading>
      <Text>Holding</Text>
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {holdingNFTs.map((nft: NFTType) => <NFTInfo nft={nft} key={nft.cotaId} />)}
      </Flex>
      <Text>Withdrawable</Text>
      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        {withdrawableNFTs.map((nft: NFTType) => <NFTInfo nft={nft} key={nft.cotaId} />)}
      </Flex>
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
