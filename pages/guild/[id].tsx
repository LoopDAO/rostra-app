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
import { GuildListType } from "api/guild"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Icon,
  InputGroup,
} from "@chakra-ui/react"

export default function GuildDetails() {
  const { query } = useRouter()
  console.log('query: ', query)
  const { data, error } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/`,
    fetcher
  )

  const guilds = data?.guilds ?? null
  const guild = guilds?.find((g: GuildListType) => g.guild_id == query.id)

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>
  console.log("guild id page", guild)
  if (!guild) return null

  const nfts = guild.members?.nfts
  const members = guild.members

  return (
    <Flex css={{ fd: "column", gap: "$4" }}>
      <Flex css={{ fd: "row", ai: "center", gap: "$2" }}>
        <Heading size="3">{guild.name}</Heading>
      </Flex>
      <Flex css={{ fd: "row", ai: "center", gap: "$2" }}>
        <Button
          mt={4}
          colorScheme="teal"
        >
          Initiate NFT template
        </Button>
        <Button
          mt={4}
          colorScheme="teal"
        >
          Create NFT for Event
        </Button>
      </Flex>
      <Text
        css={{ color: "Gray", fontSize: "12px", marginTop: "5px" }}
        key={guild?.guild_id}
      >
        {guild?.desc}
      </Text>
    </Flex>
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
