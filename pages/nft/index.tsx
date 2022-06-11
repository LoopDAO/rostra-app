import { Box, Heading, Image, Text, Stack, Button } from "@chakra-ui/react"
import Loading from "components/Loading/index"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import { cotaService } from "@lib/utils/ckb"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { GetDefineInfoResp } from "@nervina-labs/cota-sdk"

export default function NFTDetails() {
  const { t } = useTranslation()
  const { query } = useRouter()
  const [nftInfo, setNFTInfo] = useState({} as GetDefineInfoResp)
  const { cotaId } = query
  const { name, description, issued = 0, total = 0, image } = nftInfo as any

  useEffect(() => {
    const fetchData = async () => {
      if (!cotaId) return
      const nft = await cotaService.aggregator.getDefineInfo({
        cotaId: String(cotaId),
      })
      if (nft?.name) setNFTInfo(nft)
    }
    fetchData()
  }, [cotaId])

  if (!cotaId || !nftInfo?.name) return <Loading />

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
        <Link href={`/nft/mint?cotaId=${cotaId}`} passHref>
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
