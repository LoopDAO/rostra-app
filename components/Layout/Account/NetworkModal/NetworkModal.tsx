import { useWeb3React } from "@web3-react/core"
// import { Error } from "components/common/Error"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@components/common/Dialog"
import { Grid } from "@components/common/Grid"
import { Text } from "@components/common/Text"
import { Chains, supportedChains } from "connector"
import NetworkButton from "./NetworkButton"
import requestNetworkChange from "./requestNetworkChange"

const NetworkModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { active } = useWeb3React()

  return (
    // A way to close modal when overlay is clicked
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogClose />
        <DialogTitle>
          {active ? "Supported networks" : "Select network"}
        </DialogTitle>

        <Text css={{ mb: "1.5rem" }}>
          {`It doesn't matter which supported chain you're connected to, it's only used to know your address and sign messages so each will work equally.`}
        </Text>
        <Grid columns={2} gap={4}>
          {supportedChains.map((chain) => (
            <NetworkButton
              key={chain}
              chain={chain}
              requestNetworkChange={requestNetworkChange(
                chain as keyof typeof Chains,
                onClose
              )}
            />
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default NetworkModal
