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
import { getNftManagerContract } from "@lib/utils/contracts"
import { Web3Provider } from "@ethersproject/providers"

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
  const { account, library, chainId } = useWeb3React<Web3Provider>()
  console.log('==== chainId: ', chainId)
  const [pageContent, setPageContent] = useState<string>("guildListPage")
  const [checked, setChecked] = useState(false)
  if (!library || !account || !chainId) {
    console.error("Library or account not found")
    return 'Loading...'
  }
  const signer = library.getSigner(account)
  const nftManager = getNftManagerContract(signer, chainId)


  const {
    data: guildsData,
    error: guildsError,
    isValidating: isLoadingGuildData,
  } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/`,
    fetcher
  )
  const guildsList = guildsData?.guilds

  const {
    data: userGuildsData,
    error: userGuildsError,
    isValidating: isLoadingUserGuilds,
  } = useSWR(
    () =>
      account
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/${account}`
        : null,
    fetcher
  )

  if (guildsError || userGuildsError)
    return <div>{guildsError?.message || userGuildsError?.message}</div>

  if (isLoadingGuildData || isLoadingUserGuilds) return <div>Loading...</div>

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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGuilds),
    })
      .then(async (resp) => {
        await nftManager.connect(signer).createGuild(newGuilds.name, '', [])
        const data = await resp.json()
        if (data.message == "SUCCESS") {
          setPageContent("guildListPage")
          console.log('newGuilds.name:', newGuilds.name)
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
          <Flex css={{ marginTop: "$4", flexWrap: 'wrap', gap: "$4" }}>
            {guildsList &&
              guildsList?.map((guild) => (
                <Box key={guild.id}>
                  <GuildInfo guild={guild} />
                </Box>
              ))}
          </Flex>
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
