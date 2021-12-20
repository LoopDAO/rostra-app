import { Container, Stack, Heading, Text } from "@chakra-ui/react"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

export default function IndexPage() {
  const { t } = useTranslation()

  return (
    <Container>
      <Stack as="main" minH="100vh" spacing={{ base: 6, md: 8 }}>
        <Heading as="h1" fontSize="xl">
          {t("title")}
        </Heading>

        <Stack spacing={{ base: 10, md: 12 }}>
          <Text>{t("description")}</Text>
        </Stack>
      </Stack>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
