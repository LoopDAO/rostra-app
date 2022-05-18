import { ControlGroup } from "@components/common/ControllGroup"
import { Flex } from "@components/common/Flex"
import { Text } from "@components/common/Text"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { useDisclosure } from "@lib/hooks/useDisclosure"
import shortenHex from "@lib/utils/shortenHex"
import { EnterIcon } from "@radix-ui/react-icons"
import { Separator } from "@radix-ui/react-separator"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import Image from "next/image"
import { FC, useContext } from "react"
import AccountButton from "./AccountButton"
import AccountModal from "./AccountModal"
import {
  generateFlashsignerAddress,
  ChainType,
  Config
} from '@nervina-labs/flashsigner'
import dynamic from 'next/dynamic'

const AccountCard = dynamic(import('./AccountCard'), {
  ssr: false
})

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

const AccountFlashsigner: FC = () => {
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)

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
        <AccountButton isLoading>Connect wallet</AccountButton>
      </AccountCard>
    )
  }

  if (!isLoggedIn) {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<EnterIcon />}
          isLoading={!triedEager}
          onClick={openWalletSelectorModal}
        >
          Connect wallet
        </AccountButton>
      </AccountCard>
    )
  }
  return (
    <AccountCard>
      <ControlGroup>
        {/* FIXME: warning if uncomment */}
        {/* <AccountButton
          css={{ border: "1px solid $colors$slate7" }}
          onClick={openNetworkModal}
        >
          <Tooltip label='Flashsigner'>
            <Image
              src="/image/wallet/flashsigner.svg"
              height={12}
              width={12}
              alt="Chain avatar"
            />
          </Tooltip>
        </AccountButton>
        <Separator orientation="vertical" /> */}
        <AccountButton css={{ border: "1px solid $colors$slate7" }} onClick={onAccountModalOpen}>
          <Flex css={{ gap: "$3" }}>
            <Flex css={{ gap: 0, fd: "column", ai: "flex-end" }}>
              <Text as="span" css={{ fontSize: "$2", fontWeight: "500" }}>
                {`${shortenHex(cotaAddress, 3)}`}
              </Text>
            </Flex>
          </Flex>
        </AccountButton>
      </ControlGroup>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </AccountCard>
  )
}

export default AccountFlashsigner
