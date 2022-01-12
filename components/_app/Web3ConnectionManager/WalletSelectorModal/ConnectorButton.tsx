import Image from "next/image"
import { Button } from "@components/common/Button"

type Props = {
  name: string
  onClick: () => void
  iconUrl?: string
  disabled: boolean
  isActive: boolean
  isLoading: boolean
  rightIcon?: React.ReactElement
}

const ConnectorButton = ({
  name,
  onClick,
  rightIcon,
  iconUrl,
  disabled,
  isActive,
  isLoading,
}: Props): JSX.Element => (
  <Button
    onClick={onClick}
    rightIcon={
      rightIcon ?? (
        <Image
          src={`/image/wallet/${iconUrl}`}
          height={20}
          width={20}
          alt={`${name} logo`}
        />
      )
    }
    loadingText={`${name} - connecting...`}
    spinnerPlacement="end"
    disabled={disabled}
    isLoading={isLoading}
    size="3"
    css={{ jc: "space-between" }}
  >
    {`${name} ${isActive ? " - connected" : ""}`}
  </Button>
)

export default ConnectorButton
