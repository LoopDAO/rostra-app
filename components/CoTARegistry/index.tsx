import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { Stack, Link, Button, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import AccountFlashsigner from "../Layout/Account/AccountFlashsigner"
import { addressToScript, scriptToHash, rawTransactionToHash, serializeWitnessArgs } from "@nervosnetwork/ckb-sdk-utils"
import { generateRegisterCotaTx, getAlwaysSuccessLock, FEE } from "@nervina-labs/cota-sdk"
import {
  signMessageWithRedirect,
  Config,
  transactionToMessage,
  generateFlashsignerAddress,
} from "@nervina-labs/flashsigner"
import paramsFormatter from "@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter"
import { cotaService, hexToBalance, ckbIndexerUrl, chainType, isMainnet } from "@lib/utils/ckb"
import useSWR from "swr"
import fetchers from "api/fetchers"
import { QRCodeSVG } from "qrcode.react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { useRouter } from "next/router"

const registerCota = async (address: string, redirectPath: string) => {
  const provideCKBLock = addressToScript(address)
  const unregisteredCotaLock = addressToScript(address)
  const rawTx = await generateRegisterCotaTx(
    cotaService,
    [unregisteredCotaLock],
    provideCKBLock,
    FEE,
    isMainnet
  )
  const flashsingerDep = Config.getCellDep()
  rawTx.cellDeps.push(flashsingerDep)
  const registryLock = getAlwaysSuccessLock(isMainnet)

  const cells = rawTx.inputs.map((input, index) => ({
    outPoint: input.previousOutput,
    lock: index === 0 ? registryLock : provideCKBLock,
  }))

  const transactionHash = rawTransactionToHash(rawTx)

  const witnesses = {
    transactionHash,
    witnesses: rawTx.witnesses,
    inputCells: cells,
    skipMissingKeys: true,
  }

  const tx: any = paramsFormatter.toRawTransaction({
    ...rawTx,
    witnesses: witnesses.witnesses.map((witness) =>
      typeof witness === "string" ? witness : serializeWitnessArgs(witness)
    ),
  })

  signMessageWithRedirect("/cota-registry?sig=", {
    isRaw: false,
    message: transactionToMessage(tx, 1),
    extra: {
      txToSign: tx,
      action: "cota-registry",
      redirect: redirectPath,
    },
  })
}

export default function CotaRegistry() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(false)
  const script = addressToScript(cotaAddress)
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return
      const res = await cotaService.aggregator.checkReisteredLockHashes([scriptToHash(script)])
      setStatus(res?.registered)
    }
    fetchData()
  }, [script, isLoggedIn])

  const { data } = useSWR(() => [ckbIndexerUrl, script], fetchers.getCellsCapacity)

  if (!isLoggedIn) return <AccountFlashsigner />

  let registryBtn
  let registryElem
  if (!status) {
    registryBtn = (
      <Button
        colorScheme="teal"
        size="sm"
        ml={4}
        onClick={() => {
          setIsLoading(true)
          registerCota(cotaAddress, router.pathname)
        }}
        isLoading={isLoading}
      >
        Go
      </Button>
    )
    registryElem = (
      <Alert status="warning">
        <AlertIcon />
        {t("nft.resitryWarning")}
        {registryBtn}
      </Alert>
    )
  }

  const balance = hexToBalance(data?.result?.capacity)

  let balanceElem
  if (balance < 212) {
    balanceElem = (
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="300px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {t("nft.balanceWarning")}
          {chainType === "testnet" && (
            <Link isExternal href="https://faucet.nervos.org/">
              (Faucet <ExternalLinkIcon mx="2px" />)
            </Link>
          )}
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          <QRCodeSVG value={cotaAddress} />
        </AlertDescription>
        <AlertDescription maxWidth="sm">{cotaAddress}</AlertDescription>
        <AlertDescription maxWidth="sm"></AlertDescription>
      </Alert>
    )
  }

  return <Stack>{registryElem}{balanceElem}</Stack>
}
