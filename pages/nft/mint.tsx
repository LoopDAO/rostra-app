import React, { useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { useRouter } from 'next/router'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Box
} from "@chakra-ui/react"
import { Formik, Form, Field, FieldProps } from "formik"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { addressToScript, serializeWitnessArgs, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import {
  signMessageWithRedirect,
  appendSignatureToTransaction,
  transactionToMessage,
  generateFlashsignerAddress,
  getResultFromURL
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import { generateMintCotaTx, MintCotaInfo, FEE } from "@nervina-labs/cota-sdk"
import { padStr, cotaService, ckb, isMainnet } from "@lib/utils/ckb"
import CotaRegistry from "@components/CoTARegistry"

export default function CreateNFT() {
  const { t } = useTranslation()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const router = useRouter()
  const [issued, setIssued] = React.useState(0)
  const [registered, setRegistered] = useState(false)
  const { query, asPath } = router
  const cotaId = (query.cotaId as string) || ""

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const res = await cotaService.aggregator.checkReisteredLockHashes([scriptToHash(addressToScript(cotaAddress))])
        setRegistered(res?.registered)
      }
    }
    fetchData()
  }, [cotaAddress, isLoggedIn])

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const aggregator = cotaService.aggregator
        const nftInfo = await aggregator.getDefineInfo({
          cotaId,
        })
        setIssued(nftInfo?.issued)
      }
    }
    fetchData()
  }, [cotaAddress, isLoggedIn])

  if (!registered) {
    return (
      <>
        {t("nft.resitryWarning")}
        <CotaRegistry />
      </>
    )
  }

  function validateAddress(value: string) {
    let error
    if (!value) {
      error = "Address is required"
    }
    return error
  }

  const onSubmit = async (values: any, actions: any) => {
    console.log("values...", values)
    const { toAddress } = values
    let startIndex = issued
    const mintLock = addressToScript(cotaAddress)
    const tokenIndex = padStr((startIndex++).toString(16))
    const withdrawalInfo = {
      tokenIndex,
      state: "0x00",
      characteristic: "0x0000000000000000000000000000000000000000",
      toLockScript: serializeScript(addressToScript(toAddress)),
    }

    const mintCotaInfo: MintCotaInfo = {
      cotaId,
      withdrawals: [withdrawalInfo],
    }

    let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo, FEE, isMainnet)

    const tx: any = paramsFormatter.toRawTransaction({
      ...rawTx,
      witnesses: rawTx.witnesses.map((witness) =>
        typeof witness === "string" ? witness : serializeWitnessArgs(witness)
      ),
    })

    signMessageWithRedirect(`${asPath}?sig=`, {
      isRaw: false,
      message: transactionToMessage(tx as any),
      extra: {
        txToSign: tx,
        action: "mint-nft",
        cotaId
      },
    })
  }

  if (router.query.action === "sign-transaction" || router.query.action === "sign-message") {
    getResultFromURL(asPath, {
      onLogin(res) {
        console.log("onLogin res: ", res)
      },
      async onSignMessage(result) {
        if (!result.extra) return
        const { action, txToSign, cotaId } = result.extra
        if (action === "mint-nft") {
          const signedTx = appendSignatureToTransaction(txToSign, result.signature)
          const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
          try {
            const txHash = await ckb.rpc.sendTransaction(signedTxFormatted as any, "passthrough")
          } catch (error) {
            console.log("error: ", error)
          } finally {
            router.push({
              pathname: `/nft`,
              query: {
                cotaId,
              },
            })
          }
        }
      },
    })
  }

  return (
    <>
      <Box my={10}>CotaId: {router.query?.cotaId}</Box>
      <Formik initialValues={{ toAddress: "" }} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            <Field name="toAddress" validate={validateAddress}>
              {({ field, form }: FieldProps) => (
                <FormControl isRequired isInvalid={!!(form.errors.toAddress && form.touched.toAddress)}>
                  <FormLabel htmlFor="toAddress">To</FormLabel>
                  <Input {...field} id="toAddress" placeholder="Address" />
                  <FormErrorMessage>{form.errors.toAddress}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}

