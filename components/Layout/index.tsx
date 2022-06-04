import { FC } from "react"
import { Container } from "@chakra-ui/react"
import Header from "./Header"
import Footer from "./Footer"

export const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Container
        style={{
          minHeight: "calc(100vh - 128px)",
          overflow: "auto",
          maxWidth: "1080px",
          paddingTop: "2vh",
        }}
      >
        {children}
      </Container>
      <Footer />
    </>
  )
}
