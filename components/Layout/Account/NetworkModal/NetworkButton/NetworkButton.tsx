import { useWeb3React } from "@web3-react/core"
import Image from "next/image"
import { Chains, RPC } from "connector"
import { Box } from "@components/common/Box"
import { Button } from "@components/common/Button"
import { Tooltip } from "@components/common/Tooltip"

type Props = {
  chain: string
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const { chainId } = useWeb3React()

  const isCurrentChain = Chains[chain as keyof typeof Chains] === chainId

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${RPC[chain].chainName} is currently selected`}
    >
      <Box>
        <Button
          leftIcon={
            <Image
              height={24}
              width={24}
              src={RPC[chain].iconUrls[0]}
              alt={`${RPC[chain].chainName} logo`}
            />
          }
          disabled={isCurrentChain}
          onClick={requestNetworkChange}
          size="3"
          css={{ borderWidth: isCurrentChain ? "2px" : undefined }}
        >
          {RPC[chain].chainName}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default NetworkButton
