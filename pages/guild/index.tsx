import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { GuildListType } from "api/guild"
import { Button } from "@components/common/Button"
import { Flex } from "@components/common/Flex"
import { Box } from "@components/common/Box"
import { Heading } from "@components/common/Heading"
import GuildInfo from "@components/guild/GuildInfo"
import { Checkbox, CheckboxIndicator } from "@components/common/Checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import { Label } from "@components/common/Label"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Fieldset } from "@components/common/Fieldset"
import { Input } from "@components/common/Input"
import { useRouter } from "next/router"
import useSWR from "swr"
import { fetcher } from "api/http"

let newGuilds: GuildListType = {
  guild_id: 0,
  name: "string",
  desc: "string",
  creator: "string",
  wallet_address: "string",
  signature: "string",
  members: ["string"],
  requirements: {
    nfts: [
      {
        name: "string",
        baseURI: "string",
      },
    ],
    guilds: [],
  },
}

export default function GuildPage() {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [guildsList, setGuildsList] = useState<Array<GuildListType>>()
  const [pageContent, setPageContent] = useState<string>("guildListPage")
  const [checked, setChecked] = useState(false)
  const router = useRouter()

  const { data: guildsData, error: guildsError } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/`,
    fetcher
  )

  const { data: userGuildsData, error: userGuildsError } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/${account}/`,
    fetcher
  )

  useEffect((): any => {
    if (guildsError || userGuildsError)
      return <div>{guildsError?.message || userGuildsError?.message}</div>
    if (!guildsData || !userGuildsData) return <div>Loading...</div>

    const guilds = JSON.parse(guildsData?.result ?? null)
    const userGuilds = JSON.parse(userGuildsData?.result ?? null)

    if (checked && account) {
      setGuildsList(userGuilds)
    } else {
      setGuildsList(guilds)
    }
  }, [
    account,
    checked,
    guildsData,
    guildsError,
    userGuildsData,
    userGuildsError,
  ])

  const handleNfts = (value: string) => {
    const nfts = value.split(",").map((nft) => ({
      name: "",
      baseURI: nft,
    }))
    newGuilds.requirements.nfts = nfts
  }

  const handleGuilds = (value: string) => {
    newGuilds.requirements.guilds = value.split(",")
  }

  const handleSubmit = async () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/add/`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGuilds),
    })
      .then(async resp => {
        const data = await resp.json();
        if (data.message == "SUCCESS") {
          setPageContent("guildListPage")
        } else {
          throw Error("create new guild faild!")
        }
      })
      .then(console.log)
      .catch(console.log)
  }

  return (
    <>
      <Flex>
        <Fieldset css={{ marginLeft: "20px" }}>
          <Heading>{t("title")}</Heading>
          <Button onClick={() => setPageContent("createGuildPage")}>
            {t("guild.create")}
          </Button>
        </Fieldset>
      </Flex>
      {pageContent == "guildListPage" && (
        <Box css={{ marginLeft: "20px", font: "12px/1.5 'PT Sans', serif" }}>
          <Flex>
            <Fieldset>
              <Box>{t("guild.list")}</Box>
              <Checkbox
                defaultChecked
                id="c1"
                checked={checked}
                onCheckedChange={() => setChecked(!checked)}
              >
                <CheckboxIndicator>
                  <CheckIcon />
                </CheckboxIndicator>
              </Checkbox>
              <Label htmlFor="c1">{t("guild.guilds")}</Label>
            </Fieldset>
          </Flex>
          <Box css={{ marginTop: "$4" }}>
            {guildsList &&
              guildsList?.map((guild) => (
                <Box key={guild.creator}>
                  <GuildInfo guild={guild} />
                </Box>
              ))}
          </Box>
        </Box>
      )}
      {pageContent == "createGuildPage" && (
        <Flex
          css={{ width: "500px", marginLeft: "20px", fd: "column", gap: "$2" }}
        >
          <Fieldset>
            <Heading>{t("guild.create")}</Heading>
          </Fieldset>
          <Fieldset>
            <Label htmlFor="name">{t("guild.name")}</Label>
            <Input
              id="name"
              onChange={(e) => (newGuilds.name = e.target.value)}
            />
          </Fieldset>
          <Fieldset>
            <Label htmlFor="description">{t("guild.desc")}</Label>
            <Input
              id="description"
              onChange={(e) => (newGuilds.desc = e.target.value)}
            />
          </Fieldset>

          <Flex css={{ marginTop: 25, justifyContent: "flex-start" }}>
            <Button
              aria-label="Confirm"
              variant="gray"
              onClick={() => handleSubmit()}
              size="3"
            >
              {t("guild.confirm")}
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
