import { PropsWithChildren } from "react"
import { Button, ButtonProps } from "@components/common/Button"

const AccountButton = ({
  children,
  ...rest
}: PropsWithChildren<ButtonProps>): JSX.Element => (
  <Button {...rest}>
    {children}
  </Button>
)

export default AccountButton
