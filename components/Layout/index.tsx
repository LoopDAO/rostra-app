import { FC } from "react"
import { Container } from '@chakra-ui/react'
import Header from "./Header"
import Footer from "./Footer"

export const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Container>
        {children}
      </Container>
      <Footer />
    </>
  )
}
