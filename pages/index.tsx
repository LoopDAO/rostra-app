import {
  Container,
  Stack,
  Heading,
  Text,
  HStack,
  StackDivider,
  Box,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

export default function IndexPage() {
  const { t } = useTranslation()
  const websiteLink = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "//rostra.xyz"

  return (
    <Container>
      <Stack
        as="main"
        minH="100vh"
        spacing={{ base: 6, md: 8 }}
        divider={<StackDivider />}
      >
        <HStack
          as="header"
          display="inline-flex"
          alignItems="center"
          px="4"
          spacing="8"
        >
          <LinkBox h="60px">
            <LinkOverlay href={websiteLink}>
              <Heading as="h1" fontSize="2xl">
                {t("title")}
              </Heading>
            </LinkOverlay>
          </LinkBox>
          <Text fontSize="xs" verticalAlign="bottom">{t("description")}</Text>
        </HStack>
        <Stack spacing={{ base: 10, md: 12 }}></Stack>
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
