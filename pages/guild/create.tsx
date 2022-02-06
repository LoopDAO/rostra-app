import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { GuildListType } from "api/guild"
import { Button } from "@components/common/Button"
import { Flex } from "@components/common/Flex"
import { Heading } from "@components/common/Heading"
import { Label } from "@components/common/Label"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Fieldset } from "@components/common/Fieldset"
import { Input } from "@components/common/Input"
import { useRouter } from "next/router"
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

  if (!library || !account || !chainId) {
    console.error("Library or account not found")
    return 'Loading...'
  }
  const signer = library.getSigner(account)
  const nftManager = getNftManagerContract(signer, chainId)

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
      <Flex
        css={{ width: "500px", marginLeft: "20px", fd: "column", gap: "$2" }}
      >
        <Flex>
          <Heading>{t("guild.create")}</Heading>
        </Flex>
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
