import { useWeb3React } from "@web3-react/core"
import { useContext } from "react"
import { injected } from "connector"
import { Web3Connection } from "@components/_app/Web3ConnectionManager"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@components/common/Dialog"
import { Flex } from "@components/common/Flex"
import { Text } from "@components/common/Text"
import { Button } from "@components/common/Button"
import CopyableAddress from "@components/Layout/Account/CopyableAddress"

const AccountModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { account, connector } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)

  const handleWalletProviderSwitch = () => {
    openWalletSelectorModal()
    onClose()
  }

  return (
    // A way to close modal when overlay is clicked
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Account</DialogTitle>
        <DialogClose onClick={onClose} />

        <Flex css={{ my: "$6", gap: "$4", ai: "center" }}>
          <CopyableAddress address={account!} decimals={5} />
        </Flex>
        <Flex css={{ ai: "center", jc: "space-between", mb: "-$1" }}>
          <Text color="$gray">
            Connected with{" "}
            {connector === injected ? "MetaMask" : "WalletConnect"}
          </Text>
          <Button size="1" onClick={handleWalletProviderSwitch}>
            Switch
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

export default AccountModal
