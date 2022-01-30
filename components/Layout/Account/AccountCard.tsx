import { Box, BoxProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const AccountCard = ({
  children,
  ...props
}: PropsWithChildren<BoxProps>): JSX.Element => {
  return (
    <Box borderRadius={12} {...props}>
      {children}
    </Box>
  )
}

export default AccountCard
