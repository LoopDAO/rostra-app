import { Box, Container, Heading, SimpleGrid, Icon, Text, Stack, HStack, VStack } from "@chakra-ui/react"
import { CheckIcon } from "@chakra-ui/icons"

const featuresManager = [
  {
    id: 1,
    title: "Create NFT as many as you want",
    text: "Create NFT as many as you want",
  },
  {
    id: 2,
    title: "Reward your community members with NFTs",
    text: "Reward your community members with NFTs",
  },
  {
    id: 3,
    title: "See how many NFTs have been created",
    text: "See how many NFTs have been created",
  },
]
const featuresUser = [
  {
    id: 4,
    title: "Login with phone number",
    text: "Login with phone number",
  },
  {
    id: 5,
    title: "See what NFTs you held",
    text: "See what NFTs you held",
  },
  {
    id: 6,
    title: "Use NFTs to unlock more benefits",
    text: "Use NFTs to unlock more benefits",
  },
]



export default function GridListWithHeading() {
  return (
    <Box mb={20} maxW={800} mx="auto">
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
        <Heading fontSize={"3xl"}>What you can do with Rostra</Heading>
        {/* <Text color={"gray.600"} fontSize={"xl"}>
          See what you can do with Rostra
        </Text> */}
      </Stack>

      <Container maxW={"6xl"} mt={10}>
        <SimpleGrid columns={2} spacing={10}>
          <SimpleGrid columns={1} spacing={10}>
            <Heading as="h3" size="md">
              As a community manager
            </Heading>
            {featuresManager.map((feature) => (
              <HStack key={feature.id} align={"top"}>
                <Box color={"green.400"} px={2}>
                  <Icon as={CheckIcon} />
                </Box>
                <VStack align={"start"}>
                  {/* <Text fontWeight={600}>{feature.title}</Text> */}
                  <Text color={"gray.600"}>{feature.text}</Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
          <SimpleGrid columns={1} spacing={10}>
            <Heading as="h3" size="md">
              As a community user
            </Heading>
            {featuresUser.map((feature) => (
              <HStack key={feature.id} align={"top"}>
                <Box color={"green.400"} px={2}>
                  <Icon as={CheckIcon} />
                </Box>
                <VStack align={"start"}>
                  {/* <Text fontWeight={600}>{feature.title}</Text> */}
                  <Text color={"gray.600"}>{feature.text}</Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
