import { FC, useContext, useRef } from "react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Image from "next/image"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { LinkBreak2Icon, EnterIcon } from "@radix-ui/react-icons"

import { ControlGroup } from "@components/common/ControllGroup"
import { Flex } from "@components/common/Flex"
import { Tooltip, Text, Tag, Box } from "@chakra-ui/react"
import shortenHex from "@lib/utils/shortenHex"
import { Chains, RPC } from "connector"

import AccountButton from "./AccountButton"
import AccountCard from "./AccountCard"
import AccountModal from "./AccountModal"
import useENSName from "./useENSName"
import { Separator } from "@radix-ui/react-separator"
import { useDisclosure } from "@lib/hooks/useDisclosure"

const Account: FC = () => {
  const accountBtnRef = useRef<HTMLButtonElement>(null)
  const { error, account, chainId } = useWeb3React()
  const ENSName = useENSName(account)

  const { openWalletSelectorModal, triedEager, openNetworkModal } =
    useContext(Web3Connection)

  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure()

  if (typeof window === "undefined") {
    return (
      <AccountCard>
        <AccountButton isLoading>Connect to a wallet</AccountButton>
      </AccountCard>
    )
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <AccountCard>
        <AccountButton leftIcon={<LinkBreak2Icon />} onClick={openNetworkModal}>
          Wrong Network
        </AccountButton>
      </AccountCard>
    )
  }
  if (!account) {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<EnterIcon />}
          isLoading={!triedEager}
          onClick={openWalletSelectorModal}
        >
          Connect to a wallet
        </AccountButton>
      </AccountCard>
    )
  }
  return (
    <AccountCard bgColor="cyan.400">
      <ControlGroup>
        <Tooltip
          label={RPC[Chains[chainId!]].chainName}
          portalProps={{ containerRef: accountBtnRef }}
          hasArrow
        >
          <AccountButton onClick={openNetworkModal} ref={accountBtnRef}>
            <Image
              src={RPC[Chains[chainId!]].iconUrls[0]}
              height={12}
              width={12}
              alt="Chain avatar"
            />
          </AccountButton>
        </Tooltip>
        <Box width="1px" bgColor="gray.300" />
        <AccountButton onClick={onAccountModalOpen}>
          <Flex css={{ gap: "$3" }}>
            <Flex css={{ gap: 0, fd: "column", ai: "flex-end" }}>
              <Text as="span" sx={{ fontSize: "$2", fontWeight: "500" }}>
                {ENSName || `${shortenHex(account, 3)}`}
              </Text>
            </Flex>
          </Flex>
        </AccountButton>
      </ControlGroup>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </AccountCard>
  )
}

export default Account
