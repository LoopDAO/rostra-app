import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Fieldset } from "@components/common/Fieldset"
import { Text } from "@components/common/Text"
import { fetcher } from "api/http"
import useSWR from "swr"
import { Heading } from "@components/common/Heading"
import { Flex } from "@components/common/Flex"

export default function GuildDetails() {
  const { query } = useRouter()

  const { data, error } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get`,
    fetcher
  )

  const guilds = JSON.parse(data?.result ?? null)
  const guild = guilds?.find((g) => g.guild_id === Number(query.id))

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  if (!guild) return null

  const nfts = guild.members?.nfts
  const members = guild.members

  return (
    <Flex css={{ fd: "column", gap: "$4" }}>
      <Flex css={{ fd: "row", ai: "center", gap: "$2" }}>
        <Heading size="3">{guild.name}</Heading>
        <Text
          css={{ color: "Gray", fontSize: "12px", marginTop: "5px" }}
          key={guild?.guild_id}
        >
          {members?.length + " members"}
        </Text>
      </Flex>

      <Flex css={{ fd: 'column', gap: '$2', mt: "$6" }}>
        <Flex css={{ gap: "$2" }}>
          <Heading>NFT:</Heading>
          <Fieldset css={{ marginTop: "5px" }}>
            {!nfts?.length && "No NFTs"}
            {nfts?.map((nft: any) => (
              <Text
                css={{
                  display: "inline-flex",
                  jc: "center",
                  ai: "center",
                  backgroundColor: "$gray12",
                  color: "$white",
                  border: "3px solid gray",
                  borderRadius: "5px",
                }}
                key={nft.name}
              >
                {nft.name}
              </Text>
            ))}
          </Fieldset>
        </Flex>

        <Flex css={{ gap: "$2" }}>
          <Heading>Members:</Heading>
          {members?.map((memberGuild: any) => (
            <Text
              css={{
                display: "inline-flex",
                jc: "center",
                ai: "center",
                p: "$1",
                backgroundColor: "$blue6",
                color: "$black",
                borderRadius: "5px",
              }}
              key={memberGuild}
            >
              {memberGuild}
            </Text>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { id } = params || {}
  fetch(`http://localhost:3222/api/guild/${id}`)
    .then((resp) => resp.json())
    .then(console.log)
    .catch(console.log)

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
