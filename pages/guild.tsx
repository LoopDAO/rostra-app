import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { getGuild, getGuildByAddress, GuildListType } from "../api/guild"
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

export default function GuildPage() {
  const { t } = useTranslation()
  const { activate, account } = useWeb3React()
  const [guildsList, setGuildsList] = useState<Array<GuildListType>>()
  const [pageContent, setPageContent] = useState<string>("guildListPage")
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    activate(injected, undefined, true).catch((err) => {
      console.log(err)
    })
    if (checked && account) {
      getGuildByAddress(account)
      .then((res) => {
        console.log(res.result);
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

  return (
    <>
      <Flex>
        <Fieldset>
          <Heading>{t("title")}</Heading>
          <Button onClick={() => setPageContent("createGuildPage")}>
            {t("guild.create")}
          </Button>
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
              alt="Pedro Duarte"
            />
            <AvatarFallback delayMs={600}>JD</AvatarFallback>
          </Avatar>
        </Fieldset>
      </Flex>
      {pageContent == "guildListPage" && (
        <Box>
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
        <Box>
          <Flex>
            <Box>{t("guild.create")}</Box>
          </Flex>
          <Fieldset>
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Pedro Duarte" />
          </Fieldset>
          <Fieldset>
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@peduarte" />
          </Fieldset>
          <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
            <Button aria-label="Close" variant="green">
              Save changes
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
