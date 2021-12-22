import {
  Divider,
  Link,
  List,
  ListItem,
  TextProps,
  UnorderedList,
} from "@chakra-ui/react"
import {
  Container,
  Stack,
  Heading,
  Text,
  HStack,
  StackDivider,
  LinkBox,
  LinkOverlay,
  Button,
} from "@chakra-ui/react"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const NewLineText = ({
  text,
  children,
  ...rest
}: TextProps & { text?: string | null; children?: string }) => {
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
              <Text as="p" fontSize="md">
                {t("problems.edu.admittance.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.edu.admittance.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.edu.system.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.edu.system.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.edu.evaluation.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.edu.evaluation.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.edu.autonomy.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.edu.autonomy.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.edu.reward.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.edu.reward.description")}
              </Text>
            </Stack>
          </Stack>
          <Heading as="h2" fontSize="lg">
            {t("problems.research.title")}
          </Heading>
          <Stack spacing="6">
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.research.ownership.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.research.ownership.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.research.reward.title")}
              </Text>
              <NewLineText as="p" fontSize="xs">
                {t("problems.research.reward.description")}
              </NewLineText>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.research.creative.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.research.creative.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.research.rating.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.research.rating.description")}
              </Text>
            </Stack>
            <Stack>
              <Text as="p" fontSize="md">
                {t("problems.research.funding.title")}
              </Text>
              <Text as="p" fontSize="xs">
                {t("problems.research.funding.description")}
              </Text>
            </Stack>
          </Stack>

          {/* Changes */}
          <Heading as="h2" fontSize="lg">
            {t("changes.title")}
          </Heading>
          <Stack>
            <Text as="h2" fontSize="s">
              {t("changes.edu.title")}
            </Text>
            <UnorderedList>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target1")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target2")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target3")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target4")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target5")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target6")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target7")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.edu.target8")}
                </Text>
              </ListItem>
            </UnorderedList>
            <Text as="h2" fontSize="s">
              {t("changes.research.title")}
            </Text>
            <UnorderedList>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.research.target1")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.research.target2")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.research.target3")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.research.target4")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("changes.research.target5")}
                </Text>
              </ListItem>
            </UnorderedList>
          </Stack>
          {/* <Heading as="h2" fontSize="lg">
            {t("changes.title")}
          </Heading>
          <Stack spacing="6">
            <Stack>
              {/* Use HTML to wrap new line */}
              {/* <Text
                as="p"
                fontSize="xs"
                whiteSpace="pre-wrap"
                dangerouslySetInnerHTML={{ __html: t("changes.edu") }}
              />
              <Text
                as="p"
                fontSize="xs"
                whiteSpace="pre-wrap"
                dangerouslySetInnerHTML={{ __html: t("changes.research") }}
              />
            </Stack>
          </Stack> */} 

          {/* How */}
          <Heading as="h2" fontSize="lg">
            {t("how.title")}
          </Heading>
          <Text
            as="p"
            fontSize="sm"
            whiteSpace="pre-wrap"
            dangerouslySetInnerHTML={{ __html: t("how.description") }}
          />

          {/* Contribute */}
          <Heading as="h2" fontSize="lg">
            {t("contribute.title")}
          </Heading>
          <Stack>
            <Text as="p" fontSize="xs">
              {t("contribute.detail.title")}
            </Text>
            <UnorderedList>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("contribute.detail.period")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("contribute.detail.task")}
                </Text>
              </ListItem>
              <ListItem>
                <Text as="p" fontSize="xs">
                  {t("contribute.detail.evaluation")}
                </Text>
              </ListItem>
            </UnorderedList>
          </Stack>
          <Text as="p" fontSize="sm" color="gray.500">
            {t("contribute.discord")}{" "}
            <Link href={t("link.discord")}>{t("link.discord")}</Link>
          </Text>
          <Stack color="yellow.200">
            <Text as="p" fontSize="sm">
              {t("contribute.notion")}
            </Text>
            <Link href={t("link.notion")}>
              <Text as="p" fontSize="sm">
                {t("link.notion")}
              </Text>
            </Link>
          </Stack>
          <Divider />
          <Stack>
            <Text as="p" fontSize="sm" color="gray.300">
              {t("media.about")}:{" "}
              <Link href={t("link.mirror")}>{t("link.mirror")}</Link>
            </Text>

            <Text as="p" fontSize="sm" color="yellow.200">
              {t("media.docs")}:{" "}
              <Link href={t("link.notion")}>{t("link.notion")}</Link>
            </Text>

            <Text as="p" fontSize="sm" color="blue.200">
              {t("media.twitter")}:{" "}
              <Link href={t("link.twitter")}>{t("link.twitter")}</Link>
            </Text>

            <Text as="p" fontSize="sm" color="gray.500">
              {t("media.discord")}:{" "}
              <Link href={t("link.discord")}>{t("link.discord")}</Link>
            </Text>
            <Text as="p" fontSize="sm" color="white">
              {t("media.github")}:{" "}
              <Link href={t("link.github")}>{t("link.github")}</Link>
            </Text>
          </Stack>
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
