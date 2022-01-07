import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { getGuild, GuildListType } from "../api/guild"
import { injected } from "../connector"
import { Button } from '@components/Button';
import { Flex } from '@components/Flex';
import { Box } from '@components/Box';
import GuildInfo from './guildInfo';


export default function GuildPage() {
  const { t } = useTranslation();
  const { activate, account } = useWeb3React();
  const [guildsList, setGuildsList] = useState<Array<GuildListType>>();
  const [pageContent, setPageContent] = useState<string>("guildListPage");
  
  useEffect(() => {
    activate(injected, undefined, true).catch((err) => {
      console.log(err)
    })
    console.log(account)
    getGuild()
      .then((res) => {
        console.log(JSON.parse(res.result));
        setGuildsList(JSON.parse(res.result))
      })
      .catch((err) => {
        console.log(err);
      });
  }, [account, activate]);

  return (
    <>
      <Flex>
        <div>{t("title")}</div>
        <Button onClick={() => setPageContent('createGuildPage')}>
          {t("Create a resarch guild")}
        </Button>
        <Box>{t("Personal")}</Box> 
      </Flex>
      {pageContent == 'guildListPage' && <Box>
        <Flex>
          <Box>{t("Guild List")}</Box> 
          {/* <Checkbox>My guilds</Checkbox> */}
        </Flex>
        {guildsList && guildsList?.map((guild) => (
          <Box key={guild.name}>
            <p>{guild.name}</p>
            <GuildInfo guild={guild} />
          </Box>
        ))}
      </Box>}
      {pageContent == 'createGuildPage' && <Box>
        <Flex>
          <Box>{t("Create a guild")}</Box> 
        </Flex>
      </Box>}
    </>
  );
}