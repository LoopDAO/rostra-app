import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Flex, Heading, Stack, Container } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../../components/Layout/Account/AccountFlashsigner"
import {
  addressToScript,
  serializeScript,
  scriptToHash,
  rawTransactionToHash,
  serializeWitnessArgs
} from '@nervosnetwork/ckb-sdk-utils'
import {
  Service,
  Collector,
  Aggregator,
  generateDefineCotaTx,
  generateIssuerInfoTx,
  generateMintCotaTx,
  generateClaimCotaTx,
  generateWithdrawCotaTx,
  generateTransferCotaTx,
  generateRegisterCotaTx,
  getAlwaysSuccessLock,
  Claim,
  CotaInfo,
  IssuerInfo,
  MintCotaInfo,
  TransferWithdrawal,
} from '@nervina-labs/cota-sdk'

const service: Service = {
  collector: new Collector({
    ckbNodeUrl: 'https://testnet.ckbapp.dev/rpc', ckbIndexerUrl: 'https://testnet.ckbapp.dev/indexer'
  }),
  aggregator: new Aggregator({ registryUrl: 'http://cota-registry-aggregator.rostra.xyz', cotaUrl: 'http://cota-aggregator.rostra.xyz' }),
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()

  const [status, setStatus] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await service.aggregator.checkReisteredLockHashes([
        scriptToHash(addressToScript(account.address)),
      ])
      setStatus(res?.registered);
      console.log('res: ', res)
    };
    fetchData();
  }, [account.address]);

  if (!isLoggedIn) return <AccountFlashsigner />

  return (
    <Stack spacing={2} p={4}>
      <Heading>{t("dashboard.title")}</Heading>

      <Flex marginTop={4} flexWrap="wrap" gap={4} p={0}>
        <Container>Address: {account.address}</Container>
        <Container>Balance: {'todo'}</Container>
        <Container>CKB CoTA Registry: {status.toString()}</Container>
      </Flex>
    </Stack>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
