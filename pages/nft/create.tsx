import React, { useRef, ReactNode, useState, useEffect } from "react"
import { useTranslation } from "next-i18next"
import { useRouter } from 'next/router'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Icon,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react"
import { Formik, Form, Field, FieldProps } from "formik"
import { useForm, UseFormRegisterReturn } from "react-hook-form"
import { FiFile } from "react-icons/fi"
import { NFTStorage } from "nft.storage"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { addressToScript, serializeWitnessArgs, scriptToHash, serializeScript } from "@nervosnetwork/ckb-sdk-utils"
import {
  signMessageWithRedirect,
  appendSignatureToTransaction,
  transactionToMessage,
  generateFlashsignerAddress,
  getResultFromURL
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import { generateDefineCotaTx, CotaInfo, FEE } from "@nervina-labs/cota-sdk"
import { cotaService, ckb, isMainnet } from "@lib/utils/ckb"
import httpPost from 'api/post'
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
  const { register, formState: { errors }, } = useForm()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  const [fileObj, setFileObj] = useState<File>()
  const router = useRouter()
  const [registered, setRegistered] = useState(false)
  const [isEarlyBird, setIsEarlyBird] = useState(false)
  const toast = useToast()
  const earlyAccessNFTAddress = process.env.NEXT_PUBLIC_EARLY_ACCESS_NFT_ADDRESS || ""

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return
      const res = await cotaService.aggregator.checkReisteredLockHashes([
        scriptToHash(addressToScript(cotaAddress)),
      ])
      setRegistered(res?.registered)
    }
    fetchData()
  }, [cotaAddress, isLoggedIn])

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return
      const lockScript = serializeScript(addressToScript(cotaAddress))
      try {
        const result = await cotaService.aggregator.getCotaCount({
          lockScript,
          cotaId: earlyAccessNFTAddress,
        })
        setIsEarlyBird(result.count > 0)
      } catch (error) {
        toast({
          title: "Error happened.",
          description: error?.message?.message,
          status: "error",
          duration: 10000,
          isClosable: true,
        })
      }
    }
    fetchData()
  }, [cotaAddress, earlyAccessNFTAddress, isLoggedIn, toast])

  useEffect(() => {
    if (router.query.action !== "sign-message") return
    getResultFromURL(router.asPath, {
      onLogin(res) {
        console.log("onLogin res: ", res)
      },
      async onSignMessage(result) {
        const action = result.extra?.action
        if (action === "create-nft") {
          const signedTx = appendSignatureToTransaction(result.extra?.txToSign, result.signature)
          const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
          try {
            const txHash = await ckb.rpc.sendTransaction(signedTxFormatted as any, 'passthrough')
            const data = {
              account: account.address,
              name: result.extra?.cotaInfo.name,
              desc: result.extra?.cotaInfo.description,
              image: result.extra?.cotaInfo.image,
              total: result.extra?.totalSupply,
              cotaId: result.extra?.cotaId,
              txHash,
            }
            await postMintNFTInfo2Rostra(data)
            router.push({
              pathname: `/manage-nfts`,
            })
          } catch (error) {
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
  }, [router.query.action, router, account.address, toast])

  if (!registered) {
    return <CotaRegistry />
  }

  if (process.env.NEXT_PUBLIC_TOKEN_GATE_ENABLED === 'true' && !isEarlyBird) {
    return 'You need to hold Rostra Early Access NFT'
  }

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return "Files is required"
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024)
      const MAX_FILE_SIZE = 10
      if (fsMb > MAX_FILE_SIZE) {
        return "Max file size 10mb"
      }
    }
    return true
  }

  function validateName(value: string) {
    let error
    if (!value) {
      error = "Name is required"
    }
    return error
  }

  function validateDescription(value: string) {
    let error
    if (!value) {
      error = "Description is required"
    }
    return error
  }

  async function onFileChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileObj(file)
  }

  // @ts-expect-error TODO: Add typings
  const onSubmit = async (values, actions) => {
    const apiKey: string = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || ""
    if (!apiKey) return
    const client = new NFTStorage({ token: apiKey })
    const metadata = await client.storeBlob(fileObj as File)
    const defineLock = addressToScript(cotaAddress)

    const cotaInfo: CotaInfo = {
      name: values.name,
      description: values.description,
      image: `https://ipfs.io/ipfs/${metadata}`,
    }
    const totalSupply = values.totalSupply
    let { rawTx, cotaId } = await generateDefineCotaTx(
      cotaService,
      defineLock,
      totalSupply,
      "0x00",
      cotaInfo,
      FEE,
      isMainnet
    )
    console.log(`cotaId: ${cotaId}`)

    const tx: any = paramsFormatter.toRawTransaction({
      ...rawTx,
      witnesses: rawTx.witnesses.map((witness) =>
        typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
      )
    })

    signMessageWithRedirect(
      '/nft/create?sig=',
      {
        isRaw: false,
        message: transactionToMessage(tx as any),
        extra: {
          txToSign: tx,
          action: 'create-nft',
          cotaId,
          totalSupply,
          cotaInfo
        },
      }
    )
  }

  async function postMintNFTInfo2Rostra(data_: { account: string; name: any; desc: any; image: any; total: any; cotaId: any;  txHash: string }) {
    const url = `/nft/add`
    await httpPost(url, data_)
  }

  return (
    <>
      <CotaRegistry />
      <Formik initialValues={{ name: "", description: "", totalSupply: "" }} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            <Field name="name" validate={validateName}>
              {({ field, form }: FieldProps) => (
                <FormControl isRequired isInvalid={!!(form.errors.name && form.touched.name)}>
                  <FormLabel htmlFor="name">{t("nft.name")}</FormLabel>
                  <Input {...field} id="name" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="description" validate={validateDescription}>
              {({ field, form }: FieldProps) => (
                <FormControl isRequired isInvalid={!!(form.errors.name && form.touched.name)}>
                  <FormLabel htmlFor="description">{t("nft.description")}</FormLabel>
                  <Input {...field} id="description" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="totalSupply">
              {({ field, form }: FieldProps) => (
                <FormControl isRequired isInvalid={!!(form.errors.totalSupply && form.touched.totalSupply)}>
                  <FormLabel htmlFor="totalSupply">{t("nft.totalSupply")}</FormLabel>
                  <NumberInput {...field} onChange={(val) => form.setFieldValue(field.name, val)}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{form.errors.totalSupply}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <FormControl isInvalid={!!errors.file_} isRequired>
              <FormLabel>{t("nft.image")}</FormLabel>
              <FileUpload
                accept={"image/*"}
                multiple
                register={register("file_", { validate: validateFiles })}
                onChange={(e) => {
                  onFileChanged(e)
                }}
              >
                <Button leftIcon={<Icon as={FiFile} />}>{fileObj?.name}</Button>
              </FileUpload>

              <FormErrorMessage>{errors.file_ && errors?.file_.message}</FormErrorMessage>
            </FormControl>
            <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
              {t("nft.confirm")}
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


