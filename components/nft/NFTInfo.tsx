import React from "react"
import { useRouter } from "next/router"
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Flex
} from '@chakra-ui/react';
import { NFTType } from "../../api/nft"

export default function NFTInfo({ nft }: { nft: NFTType }) {
  const router = useRouter()
  const handleClick = (nft: NFTType) => {
    router.push({
      pathname: `/nft/${nft.cotaId}`,
    })
  }

  return (
    <Center py={2}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'xl'}
        rounded={'sm'}
        pos={'relative'}
      >
        <Box onClick={() => handleClick(nft)} cursor="pointer">
          <Image
            height={230}
            width={282}
            objectFit={'cover'}
            src={nft.image}
            alt={nft.name}
          />
        </Box>
        <Stack pt={5} align={'center'}>
          <Heading fontSize={'lg'} fontFamily={'body'} fontWeight={500}>
            {nft.name}
          </Heading>
          <Text color={'gray.500'} fontSize={'sm'}>
            {nft.description}
          </Text>
          <Text fontSize={'sm'}>
            {nft.tokenIndex}
          </Text>
        </Stack>
      </Box>
    </Center>
  );
}