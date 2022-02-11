import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Hero from './Hero'
import { Box, HStack, Center, Link, VStack } from "@chakra-ui/react";

export default function IndexPage() {
  const contentHigh = document.documentElement.clientHeight - 64 * 2  // header + footer

  return (
    <Box h={`${contentHigh}px`}>
      <Hero />
    </Box>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
