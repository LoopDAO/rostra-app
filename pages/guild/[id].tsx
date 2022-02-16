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
import { useTranslation } from "next-i18next"
import { ZERO_GUILD_ID } from "@lib/utils/constants"

const GuildInfo = (props: any) => {
  const { t } = useTranslation()
  const { guild, account, library, chainId } = props
  const signer = library.getSigner(account)
  const nftManager = getNftManagerContract(signer, chainId)

  const createNFTTemplate = async () => {
    await nftManager.connect(signer).createGuild(guild.name, '', [])
    console.log('createNFTTemplate done')
  }

  const { data: templateId } = useSWR(['guildNameToGuildId', guild.name], {
    fetcher: fetchers.contract(nftManager),
  })
  if (!templateId || templateId === ZERO_GUILD_ID) {
    return (
      <div>
        No NFT template found
        <Button onClick={createNFTTemplate}>Create One</Button>
      </div>
    )
  }
  return (
    <div>
      <div>NFT template ID: {templateId.toString()}</div>
      <Heading size="3">{t('nft.distribute')}</Heading>
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
  
  const nfts = guild?.requirements?.nfts

  let guildInfoElem

  if (creator === account) {
    guildInfoElem = <GuildInfo guild={guild} account={account} library={library} chainId={chainId} />
  }

  return (
    <Grid>
      <Grid css={{ fd: "row", ai: "center", gap: "$2" }}>
        <Heading size="3">{name}</Heading>
        <Grid>{desc}</Grid>
        <Grid>{nfts?.map(nft => (<>
          <img alt="nfts" src={nft?.baseURI}></img>
          <>{nft?.name}</>
        </>))}</Grid>
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
