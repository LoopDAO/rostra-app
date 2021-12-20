import React, { ReactNode } from 'react';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import { useTranslation } from 'next-i18next';
import '@fontsource/inter/variable-full.css';
import '@fontsource/source-code-pro/400.css';
import '@fontsource/source-code-pro/600.css';
import { AppProps } from 'next/app';

import { theme } from '../theme';
import PlausibleProvider from 'next-plausible';

const Plausible = ({ children }: { children: ReactNode }) => {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  const domainName = process.env.NEXT_PUBLIC_DOMAIN_NAME
  return isProd ? (
    <PlausibleProvider domain={domainName}>{children}</PlausibleProvider>
  ) : (
    <>{children}</>
  );
};

function SEO() {
  const { t } = useTranslation();

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      {/* Primary Meta Tags */}
      <title>{t('title')}</title>
      <meta name="title" content={t('title')} />
      <meta name="description" content={t('description')} />
      {/* Favicon Images */}
      <meta name="application-name" content=" " />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
    </Head>
  );
}

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <SEO />
    <Plausible>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Plausible>
  </>
);

export default appWithTranslation(App);
