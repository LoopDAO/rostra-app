import React, { useEffect } from "react"
import { useTranslation } from "next-i18next"
import { useRouter } from 'next/router'
import { FormControl, FormLabel, FormErrorMessage, Textarea, Button, Box, useToast } from "@chakra-ui/react"
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
  const { query, asPath } = router
  const cotaId = (query.cotaId as string) || ""
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && cotaId.length === 42) {
        const aggregator = cotaService.aggregator
        const nftInfo = await aggregator.getDefineInfo({
          cotaId,
        })
        setIssued(nftInfo?.issued)
      }
    }
    fetchData()
  }, [cotaId, isLoggedIn])

  function validateAddress(value: string) {
    let error
    if (!value) {
      error = "Address is required"
    }
    return error
  }

  const onSubmit = async (values: any, actions: any) => {
    const { toAddress } = values
    const addressArr = toAddress.split(",")
    let startIndex = issued
    const mintLock = addressToScript(cotaAddress)
    const withdrawals = addressArr.map((address: string) => {
      const tokenIndex = padStr((startIndex++).toString(16))
      return {
        tokenIndex,
        state: "0x00",
        characteristic: "0x0000000000000000000000000000000000000000",
        toLockScript: serializeScript(addressToScript(address.trim())),
      }
    })
    const mintCotaInfo: MintCotaInfo = {
      cotaId,
      withdrawals,
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

  useEffect(() => {
    if (router.query.action !== "sign-message") return
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
            await ckb.rpc.sendTransaction(signedTxFormatted as any, "passthrough")
            toast({
              title: "Transaction sent.",
              description: "Transaction has been sent to the network, please wait for about 1 minute.",
              status: "success",
              duration: 5000,
              isClosable: true,
            })
            setTimeout(() => {
              router.push({
                pathname: `/nft`,
                query: {
                  cotaId,
                },
              })
            }, 5000)
          } catch (error: any) {
            toast({
              title: "Error happened.",
              description: error?.message?.message,
              status: "error",
              duration: 10000,
              isClosable: true,
            })
          }
        }
      },
    })
  }, [router.query.action, asPath, router, toast])

  return (
    <Box>
      <CotaRegistry />
      <Box my={10}>
        {t("nft.nftAddress")}: {router.query?.cotaId}
      </Box>
      <Formik initialValues={{ toAddress: "" }} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            <Field name="toAddress" validate={validateAddress}>
              {({ field, form }: FieldProps) => (
                <FormControl isRequired isInvalid={!!(form.errors.toAddress && form.touched.toAddress)}>
                  <FormLabel htmlFor="toAddress">To</FormLabel>
                  <Textarea {...field} id="toAddress" placeholder="Addresses, separate by comma" />
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
    </Box>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}

