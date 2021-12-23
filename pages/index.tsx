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
  Button,
  Spacer,
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
              <Heading as="h1">{t("title")}</Heading>
            </LinkOverlay>
          </LinkBox>
          <Text fontSize="xs" verticalAlign="bottom">
            {t("description")}
          </Text>
        </HStack>
        <Stack spacing="4">
          <Heading as="h4" fontSize="sm">
            {t("mission")}
          </Heading>
          <Button width="md">{t("action.gotoapp")}</Button>
        </Stack>

        {/* Problems */}
        <Stack spacing="4">
          <Heading as="h2" fontSize="lg">
            {t("problems.title")}
          </Heading>
          <Heading as="h2" fontSize="lg">
            {t("problems.edu.title")}
          </Heading>
          <Stack spacing="6">
            <Stack>
              <Text as="p" fontSize="sm">
                {t("problems.edu.admittance.title")}
              </Text>
              <Text as="p" fontSize="sm">
                {t("problems.edu.admittance.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="sm">
                {t("problems.edu.system.title")}
              </Text>
              <Text as="p" fontSize="sm">
                {t("problems.edu.system.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="sm">
                {t("problems.edu.evaluation.title")}
              </Text>
              <Text as="p" fontSize="sm">
                {t("problems.edu.evaluation.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="sm">
                {t("problems.edu.autonomy.title")}
              </Text>
              <Text as="p" fontSize="sm">
                {t("problems.edu.autonomy.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="sm">
                {t("problems.edu.reward.title")}
              </Text>
              <Text as="p" fontSize="sm">
                {t("problems.edu.reward.description")}
              </Text>
            </Stack>
          </Stack>

          {/* Changes */}
          <Heading as="h2" fontSize="lg">
            {t("changes.title")}
          </Heading>
          <Stack spacing="6">
            <Stack>
              {/* Use HTML to wrap new line */}
              <Text
                as="p"
                fontSize="sm"
                whiteSpace="pre-wrap"
                dangerouslySetInnerHTML={{ __html: t("changes.edu") }}
              />
              <Text
                as="p"
                fontSize="sm"
                whiteSpace="pre-wrap"
                dangerouslySetInnerHTML={{ __html: t("changes.research") }}
              />
            </Stack>
          </Stack>
        </Stack>
        {/* TODO: Rest of home content */}
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
