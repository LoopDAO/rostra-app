import { ReactNode } from "react"
import { Box, Flex, HStack, Image, useColorModeValue } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import LocaleToggle from "./LocaleToggle"
import Account from "./Account"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "./Account/AccountFlashsigner"

const Links = [
  // "guild.guilds",
  "nft.myNFTs",
  "nft.manageNFTs",
  "nft.create",
  // "setting.airdropNFT",
  "dashboard.title"
] as const

const hrefs = {
  // "guild.guilds": "/guild",
  "guild.create": "/guild/create",
  "nft.myNFTs": "/mynfts",
  "nft.manageNFTs": "/manage-nfts",
  "nft.create": "/nft/create",
  "setting.airdropNFT": "/setting",
  "dashboard.title": "/dashboard",
} as const

const NavLink = ({ children, href }: { children: ReactNode; href: any }) => (
  <Link href={href}>{children}</Link>
)

export default function Header() {
  const { t } = useTranslation()
  const { isLoggedIn } = useAccountFlashsigner()

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Link href="/" passHref>
              <Image boxSize="60px" objectFit="cover" src="/logo192.png" alt="Logo" />
            </Link>
            <HStack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link} href={hrefs[link]}>
                  {t(link)}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={"center"}>
            <LocaleToggle />
            {/* <Link href="/guild/create" passHref>
              <Button
                variant={"solid"}
                colorScheme={"green"}
                size={"sm"}
                ml={4}
                mr={4}
                leftIcon={<AddIcon />}
              >
                Guild
              </Button>
            </Link> */}
            <AccountFlashsigner />
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
