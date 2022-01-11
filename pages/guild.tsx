import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { getGuild, getGuildByAddress, addGuild, GuildListType } from "../api/guild"
import { injected } from "../connector"
import { Button } from "@components/Button"
import { Flex } from "@components/Flex"
import { Box } from "@components/Box"
import { Heading } from "@components/Heading"
import GuildInfo from "./guildInfo"
import { Checkbox, CheckboxIndicator } from "@components/Checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import { Label } from "@components/Label"
import { Avatar, AvatarFallback, AvatarImage } from "@components/Avatar"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Fieldset } from '@components/Fieldset';
import { Input } from '@components/Input';
import { useRouter } from "next/router"

let newGuilds: GuildListType = {
  guild_id: 0,
  name: "string",
  desc: "string",
  creator: "string",
  wallet_address: "string",
  signature: "string",
  members: {
    nfts: [
      {
        name: "string",
        baseURI: "string"
      }
    ],
    guilds: []
  }
};

export default function GuildPage() {
  const { t } = useTranslation()
  const { activate, account } = useWeb3React()
  const [guildsList, setGuildsList] = useState<Array<GuildListType>>()
  const [pageContent, setPageContent] = useState<string>("guildListPage")
  const [checked, setChecked] = useState(false);
  const router = useRouter()

  useEffect(() => {
    activate(injected, undefined, true).catch((err) => {
      console.log(err)
    })
    if (checked && account) {
      getGuildByAddress(account)
      .then((res) => {
        setGuildsList(JSON.parse(res.result))
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      getGuild()
        .then((res) => {
          setGuildsList(JSON.parse(res.result))
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [account, activate, checked])

  const handleNfts = (value: string) => {
    const nfts = value.split(',').map(nft => ({
      name: "",
      baseURI: nft
    }));
    newGuilds.members.nfts = nfts;
  }

  const handleGuilds = (value: string) => {
    newGuilds.members.guilds = value.split(',')
  }

  const handleSubmit = () => {
    newGuilds.wallet_address = account || '';
    newGuilds.creator = account || '';
    addGuild(newGuilds)
      .then((res) => {
        if (JSON.parse(res).message = "SUCCESS") {
          setPageContent("guildListPage")
        } else {
          throw Error("create new guild faild!")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Flex>
        <Fieldset css={{ marginLeft: "20px" }}>
          <Heading>{t("title")}</Heading>
          <Button onClick={() => setPageContent("createGuildPage")}>
            {t("guild.create")}
          </Button>
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
              alt="Pedro Duarte"
              onClick={() => {
                setPageContent("guildListPage");
                setChecked(true);
              }}
            />
            <AvatarFallback delayMs={600}>JD</AvatarFallback>
          </Avatar>
        </Fieldset>
      </Flex>
      {pageContent == "guildListPage" && (
        <Box css={{ marginLeft: "20px" }}>
          <Flex>
            <Fieldset>
              <Box>{t("guild.list")}</Box> 
              <Checkbox 
                defaultChecked id="c1" 
                checked={checked} 
                onCheckedChange={() => setChecked(!checked)}
                >
                <CheckboxIndicator>
                  <CheckIcon />
                </CheckboxIndicator>
              </Checkbox>
              <Label htmlFor="c1">
                {t('guild.guilds')}
              </Label>
            </Fieldset>
          </Flex>
          {guildsList &&
            guildsList?.map((guild) => (
              <Box key={guild.name}>
                <GuildInfo guild={guild} />
              </Box>
            ))}
        </Box>
      )}
      {pageContent == "createGuildPage" && (
        <Box css={{ width: "500px", marginLeft: "20px" }}>
          <Fieldset>
            <Heading>{t("guild.create")}</Heading>
          </Fieldset>
          <Fieldset>
            <Label>{t("guild.info")}</Label>
          </Fieldset>
          <Fieldset>
            <Label htmlFor="name">{t("guild.name")}</Label>
            <Input id="name" onChange={(e) => newGuilds.name = e.target.value} />
          </Fieldset>
          <Fieldset>
            <Label htmlFor="description">{t("guild.desc")}</Label>
            <Input id="description" onChange={(e) => newGuilds.desc = e.target.value} />
          </Fieldset>
          <Fieldset>
            <Heading>{t("guild.requirement")}</Heading>
          </Fieldset>
          <Fieldset>
            <Label>{t("guild.requirementInfo")}</Label>
          </Fieldset>
          <Fieldset>
            <Label htmlFor="creator">{t("guild.creator")}</Label>
            <Input id="creator" onChange={(e) => newGuilds.creator = e.target.value} />
          </Fieldset>
          <Fieldset>
            <Label htmlFor="nfts">{t("guild.nft")}</Label>
            <Input id="nfts" onChange={(e) => handleNfts(e.target.value)} />
          </Fieldset>
          <Fieldset>
            <Label htmlFor="guilds">{t("guild.guild")}</Label>
            <Input id="guilds" onChange={(e) => handleGuilds(e.target.value)} />
          </Fieldset>
          <Flex css={{ marginTop: 25, justifyContent: 'flex-start' }}>
            <Button aria-label="Confirm" variant="green" onClick={() => handleSubmit()}>
              {t("guild.confirm")}
            </Button>
          </Flex>
        </Box>
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
