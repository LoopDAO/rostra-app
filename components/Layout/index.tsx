import { FC } from "react"
import { Container } from '@chakra-ui/react'
import Header from "./Header"

export const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Container>
        {children}
      </Container>
    </>
  )
}
