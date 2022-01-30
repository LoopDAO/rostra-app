import { FC } from "react"
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaGithubAlt, FaTwitter, FaDiscord, FaRegFileAlt } from 'react-icons/fa';
import { ReactNode } from 'react';
import { useTranslation } from "next-i18next"

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  const { t } = useTranslation()

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>© 2022 Rostra. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={t("link.notion")} href={t("link.notion")}>
            <FaRegFileAlt />
          </SocialButton>
          <SocialButton label={t("link.discord")} href={t("link.discord")}>
            <FaDiscord />
          </SocialButton>
          <SocialButton label={t("link.github")} href={t("link.github")}>
            <FaGithubAlt />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}