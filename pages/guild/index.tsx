import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { GuildListType } from "api/guild"
import { Button } from "@components/common/Button"
import { Flex } from "@components/common/Flex"
import { Box } from "@components/common/Box"
import { Heading } from "@components/common/Heading"
import GuildInfo from "@components/guild/GuildInfo"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Fieldset } from "@components/common/Fieldset"
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
  const [checked, setChecked] = useState(false)
  const router = useRouter()

  const { data: guildsData, error: guildsError } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get`,
    fetcher
  )

  const { data: userGuildsData, error: userGuildsError } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/${account}`,
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
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/add`, {
      method: "POST",
      body: JSON.stringify(newGuilds),
    })
      .then((resp) => {
        const data = resp.json()
        // if ((data.message = "SUCCESS")) {
        //   setPageContent("guildListPage")
        // } else {
        //   throw Error("create new guild faild!")
        // }
      })
      .then(console.log)
      .catch(console.log)
  }

  return (
    <>
      <Flex>
        <Fieldset css={{ marginLeft: "20px" }}>
          <Heading>{t("guild.list")}</Heading>
          <Button onClick={() => router.push("/guild/create")}>
            {t("guild.create")}
          </Button>
        </Fieldset>
      </Flex>
      <Box css={{ marginLeft: "20px", font: "12px/1.5 'PT Sans', serif" }}>
        <Flex css={{ fd: "column", gap: "$2", marginTop: "$4" }}>
          {guildsList &&
            guildsList?.map((guild) => (
              <Box key={guild.creator}>
                <GuildInfo guild={guild} />
              </Box>
            ))}
        </Flex>
      </Box>
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
