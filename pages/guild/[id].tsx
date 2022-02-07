import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import fetchers from "api/fetchers"
import useSWR from "swr"
import { Heading } from "@components/common/Heading"
import { Grid } from "@components/common/Grid"
import { GuildType } from "api/guild"
import { getNftManagerContract } from "@lib/utils/contracts"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { Button } from "@chakra-ui/react"
import Distribute from "components/distribute"

const GuildInfo = (props: any) => {
  const { guild, account, library, chainId } = props
  const signer = library.getSigner(account)
  const nftManager = getNftManagerContract(signer, chainId)

  const { data: templateId } = useSWR(['guildNameToGuildId', guild.name], {
    fetcher: fetchers.contract(nftManager),
  })
  if (!templateId) {
    return (
      <div>
        No NFT template found
        <Button>Create One</Button>
      </div>
    )
  }
  return (
    <div>
      <div>NFT template ID: {templateId.toString()}</div>
      <Distribute guild={{ ...guild, guildId: templateId }} />
    </div>
  )
}

export default function GuildDetails() {
  const { account, library, chainId } = useWeb3React<Web3Provider>()
  const { query } = useRouter()
  console.log('query: ', query)
  const { data, error } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/${query.id}`,
    fetchers.http
  )
  console.log('data: ', data)
  const guild: GuildType = data?.result

  if (error) return <div>{error.message}</div>
  if (!guild || !account || !library || !chainId) return <div>Loading...</div>

  const { name, desc, creator } = guild

  return (
    <Grid>
      <Grid css={{ fd: "row", ai: "center", gap: "$2" }}>
        <Heading size="3">{name}</Heading>
        <Grid>{desc}</Grid>
        <Grid>Creator: {creator}</Grid>
      </Grid>
      <GuildInfo guild={guild} account={account} library={library} chainId={chainId} />
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
