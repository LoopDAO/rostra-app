import React, { useRef, ReactNode, useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { useRouter } from 'next/router'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  InputGroup,
  Box
} from "@chakra-ui/react"
import { Formik, Form, Field, FieldProps } from "formik"
import { useForm, UseFormRegisterReturn } from "react-hook-form"
import { GetStaticProps, GetStaticPaths } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { addressToScript, serializeWitnessArgs, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import {
  signMessageWithRedirect,
  appendSignatureToTransaction,
  Config,
  transactionToMessage,
  generateFlashsignerAddress,
  ChainType,
  getResultFromURL
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import { generateMintCotaTx, MintCotaInfo } from '@nervina-labs/cota-sdk'
import { padStr, cotaService, ckb } from "@lib/utils/ckb"
import RegisterWarning from "@components/Warning/Register"
import CotaRegistry from "@components/CoTARegistry"

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children, onChange } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void
  }

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type={"file"}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
        onChange={(e) => {
          onChange && onChange(e)
        }}
      />
      <>{children}</>
    </InputGroup>
  )
}

export default function CreateNFT() {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors }, } = useForm()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [fileObj, setFileObj] = useState<File>()
  const router = useRouter()
  const [issued, setIssued] = React.useState(0)
  const [registered, setRegistered] = useState(false)
  const { query, asPath } = router
  const cotaId = query.cotaId as string || ''

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const res = await cotaService.aggregator.checkReisteredLockHashes([
          scriptToHash(addressToScript(cotaAddress)),
        ])
        setRegistered(res?.registered);
        console.log('res: ', res)
      }
    };
    fetchData();
  }, [cotaAddress, isLoggedIn]);


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
      state: '0x00',
      characteristic: '0x0000000000000000000000000000000000000000',
      toLockScript: serializeScript(addressToScript(toAddress)),
    }

    const mintCotaInfo: MintCotaInfo = {
      cotaId,
      withdrawals: [withdrawalInfo],
    }
    console.log('mintCotaInfo: ', mintCotaInfo)

    let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo)

    const tx: any = paramsFormatter.toRawTransaction({
      ...rawTx,
      witnesses: rawTx.witnesses.map((witness) =>
        typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
      )
    })
    console.log('asPath: ', asPath)
    signMessageWithRedirect(
      `${asPath}?sig=`,
      {
        isRaw: false,
        message: transactionToMessage(tx as any),
        extra: {
          txToSign: tx,
          action: 'mint-nft'
        },
      }
    )
  }

  if (router.query.action === 'sign-transaction' || router.query.action === 'sign-message') {
    console.log('router.query.action: ', router.query.action);
    getResultFromURL(asPath, {
      onLogin(res) {
        console.log('onLogin res: ', res)
      },
      async onSignMessage(result) {
        const action = result.extra?.action
        console.log("onSignMessage result: ", result)

        if (action === 'mint-nft') {
          const signedTx = appendSignatureToTransaction(result.extra?.txToSign, result.signature)
          console.log('signedTx: ', signedTx)
          const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
          try {
            const txHash = await ckb.rpc.sendTransaction(signedTxFormatted as any, 'passthrough')
            console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
          } catch (error) {
            console.log('error: ', error)
          } finally {
            router.push({
              pathname: `/nft`,
              query: {
                cotaId,
              },
            })

          }
        }
      }
    })
  }

  return (
    <>
    <Box my={10}>CotaId: {router.query?.cotaId}</Box>
    <Formik
      initialValues={{ toAddress: "" }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <Field name="toAddress" validate={validateAddress}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isRequired
                isInvalid={!!(form.errors.toAddress && form.touched.toAddress)}
              >
                <FormLabel htmlFor="toAddress">To</FormLabel>
                <Input {...field} id="toAddress" placeholder="Address" />
                <FormErrorMessage>{form.errors.toAddress}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
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

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: "blocking",
//   }
// }

