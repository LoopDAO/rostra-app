import React, { ReactNode } from "react"
import Head from "next/head"
import { ChakraProvider } from "@chakra-ui/react"
import { appWithTranslation } from "next-i18next"
import { useTranslation } from "next-i18next"
import { AppProps } from "next/app"
import PlausibleProvider from "next-plausible"
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers"

import "@fontsource/inter/variable-full.css"
import "@fontsource/source-code-pro/400.css"
import "@fontsource/source-code-pro/600.css"

import { theme } from "../theme"

const Plausible = ({ children }: { children: ReactNode }) => {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
  const domainName = process.env.NEXT_PUBLIC_DOMAIN_NAME
  if (isProd && domainName) {
    return <PlausibleProvider domain={domainName}>{children}</PlausibleProvider>
  }
  return <>{children}</>
}

function SEO() {
  const { t } = useTranslation()

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      {/* Primary Meta Tags */}
      <title>{t("title")}</title>
      <meta name="title" content={t("title")} />
      <meta name="description" content={t("description")} />
      {/* Favicon Images */}
      <meta name="application-name" content=" " />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      {/*
        manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
      */}
      <link rel="manifest" href="manifest.json" />
    </Head>
  )
}
const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) =>
  new Web3Provider(provider)

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <SEO />
    <Plausible>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Web3ReactProvider>
    </Plausible>
  </>
)

export default appWithTranslation(App)
