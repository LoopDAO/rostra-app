import { FC } from "react"
import { useTranslation } from "next-i18next"
import { Container } from "@components/common/Container"
import { Flex } from "@components/common/Flex"
import { Heading } from "@components/common/Heading"
import { Text } from "@components/common/Text"
import { Link } from "@components/common/Link"
import { ThemeToggle } from "@components/Layout/ThemeToggle"
import Account from "./Account"
import { LocaleToggle } from "./LocaleToggle"

export const Layout: FC = ({ children }) => {
  const { t } = useTranslation()
  const websiteLink = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "//rostra.xyz"

  return (
    <Container size={3} css={{ py: "$4" }}>
      <Flex as="main" css={{ fd: "column", gap: "$4" }}>
        <Flex
          as="header"
          css={{
            px: "$4",
            display: "inline-flex",
            gap: "$2",
            flexWrap: "wrap",
            ai: "center",
            jc: "flex-end",
            "@bp1": {
              jc: "space-between",
            },
          }}
        >
          <Flex>
            <Link href={websiteLink}>
              <Heading as="h1">{t("title")}</Heading>
            </Link>
            <Text size="3">{t("description")}</Text>
          </Flex>
          <Flex css={{ gap: "$1" }}>
            <LocaleToggle />
            <ThemeToggle />
            <Account />
          </Flex>
        </Flex>
        {children}
      </Flex>
    </Container>
  )
}
