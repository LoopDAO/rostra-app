import { forwardRef, PropsWithChildren } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"

const AccountButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...rest }: PropsWithChildren<ButtonProps>, ref): JSX.Element => (
    <Button
      type="button"
      colorScheme="cyan"
      color="white"
      size="sm"
      ref={ref}
      {...rest}
    >
      {children}
    </Button>
  )
)

export default AccountButton
