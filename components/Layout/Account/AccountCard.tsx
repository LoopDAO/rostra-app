import { Card } from "@components/common/Card"
import { PropsWithChildren } from "react"

const AccountCard = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  return (
    <Card
      variant="ghost"
      // bg={colorMode === "light" ? "blackAlpha.400" : "blackAlpha.300"}
      // boxShadow="none"
      // overflow="visible"
    >
      {children}
    </Card>
  )
}

export default AccountCard
