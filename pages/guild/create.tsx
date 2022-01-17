import React from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import { Button } from "@components/common/Button"
import { Fieldset } from "@components/common/Fieldset"
import { Flex } from "@components/common/Flex"
import { Heading } from "@components/common/Heading"
import { Input } from "@components/common/Input"
import { Label } from "@components/common/Label"
import { ChevronLeftIcon } from "@radix-ui/react-icons"

const CreateGuild = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <Flex>
        <Fieldset css={{ marginLeft: "20px" }}>
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon />
          </Button>
          <Heading>{t("guild.create")}</Heading>
        </Fieldset>
      </Flex>
      <Flex
        css={{ width: "500px", marginLeft: "20px", fd: "column", gap: "$2" }}
      >
        <Fieldset>
          <Heading>{t("guild.create")}</Heading>
        </Fieldset>
        <Fieldset>
          <Label>{t("guild.info")}</Label>
        </Fieldset>
        <Fieldset>
          <Label htmlFor="name">{t("guild.name")}</Label>
          <Input id="name" onChange={null} />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="description">{t("guild.desc")}</Label>
          <Input id="description" onChange={null} />
        </Fieldset>
        <Fieldset>
          <Heading>{t("guild.requirement")}</Heading>
        </Fieldset>
        <Fieldset>
          <Label>{t("guild.requirementInfo")}</Label>
        </Fieldset>
        <Fieldset>
          <Label htmlFor="creator">{t("guild.creator")}</Label>
          <Input id="creator" onChange={(e) => null} />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="nfts">{t("guild.nft")}</Label>
          <Input id="nfts" onChange={null} />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="guilds">{t("guild.guild")}</Label>
          <Input id="guilds" onChange={null} />
        </Fieldset>
        <Flex css={{ marginTop: 25, justifyContent: "flex-start" }}>
          <Button aria-label="Confirm" variant="gray" onClick={null} size="3">
            {t("guild.confirm")}
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default CreateGuild

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
