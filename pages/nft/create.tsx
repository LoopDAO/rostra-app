import React, { useRef, ReactNode, useState } from "react"
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
  Box
} from "@chakra-ui/react"
import { Formik, Form, Field, FieldProps } from "formik"
import { useForm, UseFormRegisterReturn } from "react-hook-form"
import { FiFile } from "react-icons/fi"
import { NFTStorage, File } from "nft.storage"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { getNftManagerContract } from "@lib/utils/contracts"
import { ZERO_GUILD_ID } from "@lib/utils/constants"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import {
  addressToScript,
  serializeScript,
  scriptToHash,
  rawTransactionToHash,
  serializeWitnessArgs,
  serializeWitnesses
} from '@nervosnetwork/ckb-sdk-utils'
import {
  signMessageWithRedirect,
  signTransactionWithRedirect,
  appendSignatureToTransaction,
  Config,
  transactionToMessage,
  generateFlashsignerAddress,
  ChainType,
  getResultFromURL, FlashsignerAction
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import {
  Collector,
  Aggregator,
  generateDefineCotaTx,
  generateIssuerInfoTx,
  CotaInfo,
  IssuerInfo,
  Service
} from '@nervina-labs/cota-sdk'
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { account, isLoggedIn } = useAccountFlashsigner()
  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  console.log(' ===== cotaAddress: ', cotaAddress)
  const [ipfsUrl, setIpfsUrl] = useState("")
  const [fileObj, setFileObj] = useState<File>()

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
    console.log(e.target.files)
    const file = e.target.files?.[0]
    if (!file) return
    console.log(file.name, file.type)
    setFileObj(file)
  }

  // @ts-expect-error TODO: Add typings
  const onSubmit = async (values, actions) => {
    console.log("values...", values)

    const defineLock = addressToScript(cotaAddress)

    const cotaInfo: CotaInfo = {
      name: values.name,
      description: values.description,
      image: 'ipfs://bafyreidq5eujpiq5fkygqtmiy7ansuyeujsvpnwieagekmr4y6gllzdsq4/metadata.json'
    }
    const totalSupply = values.totalSupply
    let { rawTx, cotaId } = await generateDefineCotaTx(cotaService, defineLock, totalSupply, '0x00', cotaInfo)
    console.log(` ======> cotaId: ${cotaId}`)
    console.log('======> rawTx:', JSON.stringify(rawTx, null, 2))

    const tx: any = paramsFormatter.toRawTransaction({
      ...rawTx,
      witnesses: rawTx.witnesses.map((witness) =>
        typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
      )
    })

    signMessageWithRedirect(
      'http://localhost:3000/nft/create?sig=',
      {
        isRaw: false,
        message: transactionToMessage(tx as any),
        extra: {
          txToSign: tx,
          action: 'create-nft',
          cotaId
        },
      }
    )
  }

  const router = useRouter()
  console.log('router.query: ', router);
  if (router.query.action === 'sign-transaction' || router.query.action === 'sign-message') {
    console.log('router.query.action: ', router.query.action);
    getResultFromURL(router.asPath, {
      onLogin(res) {
        const {
          // 当登录成功时，flashsigner 会对 dapp 网站地址和时间戳进行签名，
          // 并把要签名的信息和签名返回
          message,
          signature,
          // 已授权账户的公钥
          pubkey,
          // 已授权账户的地址
          address,
          // 请求登录时的额外数据
          extra,
        } = res
        console.log('onLogin res: ', res)

      },
      async onSignMessage(result) {
        const action = result.extra?.action
        console.log(' ====== action: ', action);

        if (action === 'create-nft') {
          const signedTx = appendSignatureToTransaction(result.extra?.txToSign, result.signature)
          console.log('signedTx: ', signedTx)
          const signedTxFormatted = ckb.rpc.resultFormatter.toTransaction(signedTx as any)
          try {
            const txHash = await ckb.rpc.sendTransaction(signedTxFormatted as any, 'passthrough')
            console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
            window.location.replace('/nft/create?cotaId=' + result.extra?.cotaId)
          } catch (error) {
            console.log('error: ', error)
          }
        }
      },
      async onSignTransaction(res) {
        const {

          // 已签名的交易
          transaction,
          // 已签名账户的地址
          address,
          // 请求签名时的额外数据
          extra,
        } = res
        console.log('onSignTransaction res.transaction: ', res.transaction)
        console.log('onSignTransaction res.transaction: ', JSON.stringify(res.transaction))
        const signedTx = ckb.rpc.resultFormatter.toTransaction(res.transaction as any)
        let txHash = await ckb.rpc.sendTransaction(signedTx as any, 'passthrough')
        console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
      }
    })
  }

  return (
    <>
    <Box>CotaId: {router.query?.cotaId}</Box>
    <Formik
      initialValues={{ name: "", description: "", totalSupply: 10000 }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <Field name="name" validate={validateName}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isRequired
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input {...field} id="name" placeholder="Name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="description" validate={validateDescription}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isRequired
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel htmlFor="description">Description</FormLabel>
                <Input {...field} id="description" placeholder="Description" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="totalSupply">
            {({ field, form }: FieldProps) => (
              <FormControl
                isRequired
                isInvalid={!!(form.errors.totalSupply && form.touched.totalSupply)}
              >
                <FormLabel htmlFor="totalSupply">Total Supply</FormLabel>
                <NumberInput
                  {...field}
                  onChange={(val) => form.setFieldValue(field.name, val)}
                >
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
            <FormLabel>{"Image"}</FormLabel>
            <FileUpload
              accept={"image/*"}
              multiple
              register={register("file_", { validate: validateFiles })}
              onChange={(e) => {
                onFileChanged(e)
              }}
            >
              <Button leftIcon={<Icon as={FiFile} />}>Upload {ipfsUrl}</Button>
            </FileUpload>

            <FormErrorMessage>
              {errors.file_ && errors?.file_.message}
            </FormErrorMessage>
          </FormControl>
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


