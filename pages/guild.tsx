import React, { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { getGuild, GuildListType } from "../api/guild"
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

export default function GuildPage() {
  const { t } = useTranslation()
  const { activate, account } = useWeb3React()
  const [guildsList, setGuildsList] = useState<Array<GuildListType>>()
  const [pageContent, setPageContent] = useState<string>("guildListPage")
  const [checked, setChecked] = useState("indeterminate")

  useEffect(() => {
    activate(injected, undefined, true).catch((err) => {
      console.log(err)
    })
    console.log(account)
    getGuild()
      .then((res) => {
        console.log(JSON.parse(res.result))
        setGuildsList(JSON.parse(res.result))
      })
      .catch((err) => {
        console.log(err)
      })
  }, [account, activate])

  return (
    <>
      <Flex>
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
      </Flex>
      {pageContent == "guildListPage" && (
        <Box>
          <Flex>
            <Box>{t("guild.list")}</Box>
            <Checkbox defaultChecked id="c1">
              <CheckboxIndicator>
                <CheckIcon />
              </CheckboxIndicator>
            </Checkbox>
            <Label css={{ paddingLeft: 15 }} htmlFor="c1">
              {t("guilds")}
            </Label>
          </Flex>
          {guildsList &&
            guildsList?.map((guild) => (
              <Box key={guild.name}>
                <p>{guild.name}</p>
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
        </Box>
      )}
    </>
  )
}
