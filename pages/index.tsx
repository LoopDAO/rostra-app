import { ComponentProps } from "react"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { Web3Provider } from "@ethersproject/providers"

import { Text } from "@components/common/Text"
import { Flex } from "@components/common/Flex"
import { Heading } from "@components/common/Heading"
import { OrderedList } from "@components/common/OrderedList"
import { ListItem } from "@components/common/ListItem"
import { Link } from "@components/common/Link"
import { Separator } from "@components/common/Separator"
import { List } from "@components/common/List"
import { Button } from "@components/common/Button"

type NewLineTextProps = ComponentProps<typeof Text> & {
  text?: string | null
  children?: string
  as?: any
}
const NewLineText = ({ text, children, as, ...rest }: NewLineTextProps) => {
  const hasTextOrChildren = !!text || !!children
  if (!hasTextOrChildren) return null
  const contents = (text ?? children)!.split("\n")

  if (contents.length > 1) {
    return (
      <>
        {contents.map((content) => (
          <Text {...rest} key={content}>
            {content}
          </Text>
        ))}
      </>
    )
  }
  return <Text {...rest}>{children}</Text>
}

type WindowType = Window & typeof globalThis & { ethereum: Web3Provider }

export default function IndexPage() {
  const { t } = useTranslation()
  const router = useRouter()

  const handleClick = () => {
    const { ethereum } = window as WindowType
    if (ethereum) {
      router.push("/guild")
    } else {
      alert("请先下载Chrome应用商店内下载MetaMask!")
    }
  }

  return (
    <>
      <Flex css={{ fd: "column", gap: "$4" }}>
        <Heading as="h4">{t("mission")}</Heading>
        <Button size="2" onClick={() => handleClick()}>
          {t("action.gotoapp")}
        </Button>
      </Flex>
      {/* Problems */}
      <Flex css={{ fd: "column", gap: "$4" }}>
        <Heading as="h2">{t("problems.title")}</Heading>
        <Heading as="h2">{t("problems.edu.title")}</Heading>
        <Flex css={{ gap: "$6" }}>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.edu.admittance.title")}</Text>
            <Text as="p">{t("problems.edu.admittance.description")}</Text>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.edu.system.title")}</Text>
            <Text as="p">{t("problems.edu.system.description")}</Text>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.edu.evaluation.title")}</Text>
            <Text as="p">{t("problems.edu.evaluation.description")}</Text>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.edu.autonomy.title")}</Text>
            <Text as="p">{t("problems.edu.autonomy.description")}</Text>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.edu.reward.title")}</Text>
            <Text as="p">{t("problems.edu.reward.description")}</Text>
          </Flex>
        </Flex>
        <Heading as="h2">{t("problems.research.title")}</Heading>
        <Flex css={{ gap: "$6" }}>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.research.ownership.title")}</Text>
            <Text as="p">{t("problems.research.ownership.description")}</Text>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.research.reward.title")}</Text>
            <NewLineText as="p">
              {t("problems.research.reward.description")}
            </NewLineText>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.research.creative.title")}</Text>
            <Text as="p">{t("problems.research.creative.description")}</Text>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.research.rating.title")}</Text>
            <Text as="p">{t("problems.research.rating.description")}</Text>
          </Flex>
          <Flex css={{ gap: "$2" }}>
            <Text as="p">{t("problems.research.funding.title")}</Text>
            <Text as="p">{t("problems.research.funding.description")}</Text>
          </Flex>
        </Flex>

        {/* Changes */}
        <Heading as="h2">{t("changes.title")}</Heading>
        <Flex>
          <Text as="h2">{t("changes.edu.title")}</Text>
          <List>
            <ListItem>
              <Text as="p">{t("changes.edu.knowledge")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.edu.diversity")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.edu.exploration")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.edu.personalized")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.edu.acquire")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.edu.decentralize")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.edu.evaluation")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.edu.earn")}</Text>
            </ListItem>
          </List>
          <Text as="h2">{t("changes.research.title")}</Text>
          <List>
            <ListItem>
              <Text as="p">{t("changes.research.ownership")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.research.reward")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.research.evaluation")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.research.achievements")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("changes.research.access")}</Text>
            </ListItem>
          </List>
        </Flex>

        {/* How */}
        <Heading as="h2">{t("how.title")}</Heading>
        <Text
          as="p"
          css={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: t("how.description") }}
        />

        {/* Contribute */}
        <Heading as="h2">{t("contribute.title")}</Heading>
        <Flex>
          <Text as="p">{t("contribute.detail.title")}</Text>
          <OrderedList>
            <ListItem>
              <Text as="p">{t("contribute.detail.period")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("contribute.detail.task")}</Text>
            </ListItem>
            <ListItem>
              <Text as="p">{t("contribute.detail.evaluation")}</Text>
            </ListItem>
          </OrderedList>
        </Flex>
        <Text as="p" color="gray.500">
          {t("contribute.discord")}{" "}
          <Link href={t("link.discord")}>{t("link.discord")}</Link>
        </Text>
        <Flex color="yellow.200">
          <Text as="p">{t("contribute.notion")}</Text>
          <Link href={t("link.notion")}>
            <Text as="p">{t("link.notion")}</Text>
          </Link>
        </Flex>
        <Separator />

        <Flex css={{ fd: "column", wordBreak: "break-all", gap: "$1" }}>
          <Text as="p" color="gray.300">
            {t("media.about")}:{" "}
            <Link href={t("link.mirror")}>{t("link.mirror")}</Link>
          </Text>

          <Text as="p" color="yellow.200">
            {t("media.docs")}:{" "}
            <Link href={t("link.notion")}>{t("link.notion")}</Link>
          </Text>

          <Text as="p" color="blue.200">
            {t("media.twitter")}:{" "}
            <Link href={t("link.twitter")}>{t("link.twitter")}</Link>
          </Text>

          <Text as="p" color="gray.500">
            {t("media.discord")}:{" "}
            <Link href={t("link.discord")}>{t("link.discord")}</Link>
          </Text>
          <Text as="p" color="white">
            {t("media.github")}:{" "}
            <Link href={t("link.github")}>{t("link.github")}</Link>
          </Text>
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
