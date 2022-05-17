import shortenHex from "@lib/utils/shortenHex"
import { useClipboard } from "use-clipboard-copy"
import { Tooltip } from "../../common/Tooltip"
import { Button, ButtonProps } from "../../common/Button"
import { Text } from "../../common/Text"

type Props = ButtonProps & {
  address: string
  decimals?: number
}

export const CopyableAddress = ({
  address,
  decimals = 3,
  ...rest
}: Props): JSX.Element => {
  const { copied, copy } = useClipboard()

  return (
    <Tooltip side="right" label={copied ? "Copied" : "Click to copy address"}>
      <Button
        size="3"
        css={{ backgroundColor: "transparent", px: "$0" }}
        onClick={() => copy(address)}
        {...rest}
      >
        <Text size="7">{shortenHex(address, decimals)}</Text>
      </Button>
    </Tooltip>
  )
}

export default CopyableAddress
