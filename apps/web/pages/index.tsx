import { Container, Stack, StackDivider, Heading } from "@chakra-ui/react"
import { useTranslation } from "next-i18next"

export default function Web() {
  const { t } = useTranslation()

  return (
    <Container>
      <Stack
        as="main"
        minH="100vh"
        spacing={{ base: 6, md: 8 }}
        divider={
          <StackDivider
            h="2px"
            rounded="sm"
            bgGradient="linear(to-r, red.300, orange.300, yellow.300, green.300, blue.300, purple.300, pink.300)"
          />
        }
      >
        <Heading as="h1" fontSize="xl">
          {t("title")}
        </Heading>
      </Stack>
    </Container>
  )
}
