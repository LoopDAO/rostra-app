import {
  Grid, Heading,
  Image,
  Text
} from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { useWeb3React } from "@web3-react/core"
import fetchers from "api/fetchers"
import { GuildType } from "api/guild"
import Loading from "components/Loading/index"
import { GetStaticPaths, GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"


export default function NFTDetails() {
  const { isLoggedIn: isLoggedInFlash } = useAccountFlashsigner()
  const { account, library, chainId } = useWeb3React<Web3Provider>()
  const { query } = useRouter()
  const { data, error } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/guild/${query.id}`,
    fetchers.http
  )
  const guild: GuildType = data?.result

  if (error) return <div>{error.message}</div>
  if (!guild) return <Loading />
  if (!isLoggedInFlash && (!account || !library || !chainId)) return <Loading />

  const { name, desc } = guild


  let guildInfoElem

  return (
    <Grid>
      <Grid css={{ fd: "row", ai: "center", gap: "$2" }}>
        <Heading size="2xl">{name}</Heading><br />
        <Text size="lg">{desc}</Text><br />
        <Text size="lg">25.00</Text><br />
        <Text size="lg">30.00</Text><br />
        <Image
          borderRadius='full'
          boxSize='150px'
          src='/image/nft/nft219.png'
          alt='Dan Abramov'
        />
      </Grid>
      {guildInfoElem}
    </Grid>
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
