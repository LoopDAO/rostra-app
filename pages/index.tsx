import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { Text } from "@components/common/Text"
import { Flex } from "@components/common/Flex"
import { Heading } from "@components/common/Heading"
import { Link } from "@components/common/Link"
import { Button } from "@components/common/Button"

export default function IndexPage() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <Flex css={{ fd: "column", gap: "$4" }}>
        <Heading as="h2">{t("mission")}</Heading>
        <Text as="p">{t("hero.line1")}</Text>
        <Text as="p">{t("hero.line2")}</Text>
        <Button size="2" onClick={() => router.push("/guild")}>
          {t("action.gotoapp")}
        </Button>
      </Flex>
      <Flex css={{ fd: "column", gap: "$4" }}>
        <Text as="p" color="yellow.200">
          {t("media.docs")}:{" "}
          <Link href={t("link.notion")}>{t("link.notion")}</Link>
        </Text>

        {/* <Text as="p" color="blue.200">
          {t("media.twitter")}:{" "}
          <Link href={t("link.twitter")}>{t("link.twitter")}</Link>
        </Text> */}

        <Text as="p" color="gray.500">
          {t("media.discord")}:{" "}
          <Link href={t("link.discord")}>{t("link.discord")}</Link>
        </Text>
        <Text as="p" color="white">
          {t("media.github")}:{" "}
          <Link href={t("link.github")}>{t("link.github")}</Link>
        </Text>
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
