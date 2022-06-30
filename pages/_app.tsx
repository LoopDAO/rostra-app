import React, { ReactNode, useEffect } from "react"
import Head from "next/head"
import { appWithTranslation } from "next-i18next"
import { useTranslation } from "next-i18next"
import { AppProps } from "next/app"
import PlausibleProvider from "next-plausible"
import { ThemeProvider } from "next-themes"
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import type { ExternalProvider, JsonRpcFetchFunc, } from "@ethersproject/providers"
import { ChakraProvider } from '@chakra-ui/react'
import { Config, ChainType, } from "@nervina-labs/flashsigner"
import { chainType } from "@lib/utils/ckb"
import posthog from "posthog-js"
import "@fontsource/inter/variable-full.css"
import "@fontsource/source-code-pro/400.css"
import "@fontsource/source-code-pro/600.css"
import './app.global.css'
import { darkTheme } from "stitches.config"
import { globalStyles } from "@styles/global"
import { Web3ConnectionManager } from "@components/_app/Web3ConnectionManager"
import { Layout } from "@components/Layout"

Config.setChainType(chainType as ChainType)

const Plausible = ({ children }: { children: ReactNode }) => {
  const isProd = process.env.NEXT_PUBLIC_BUILD_ENV === "production"
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
      {/* <link rel="manifest" href="manifest.json" /> */}
    </Head>
  )
}
const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) =>
  new Web3Provider(provider)

const App = ({ Component, pageProps }: AppProps) => {
  globalStyles()
  useEffect(() => {
    posthog.init("phc_ngHM4uTaDXfKlGEluBiQtMBWcsDMUNyq2iRVQ3shTOo", { api_host: "https://app.posthog.com" })
  })
  return (
    <ChakraProvider>
      <SEO />
      <Plausible>
        <ThemeProvider
          attribute="class"
          value={{ light: "light-theme", dark: darkTheme.className }}
          defaultTheme="light"
          enableSystem={false}
        >
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ConnectionManager>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Web3ConnectionManager>
          </Web3ReactProvider>
        </ThemeProvider>
      </Plausible>
    </ChakraProvider>
  )
}

export default appWithTranslation(App)
