import React, { useRef, ReactNode, useState } from "react"
import { cotaNFTType } from "../../api/nft"
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
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector, Aggregator, generateDefineCotaTx, generateIssuerInfoTx, CotaInfo, IssuerInfo, Service } from '@nervina-labs/cota-sdk'
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'
let cotaId: string = '0xd3b2bc022b52ce7282b354d97f9e5e5baf6698d7'
const secp256k1Dep = getSecp256k1CellDep(false)

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

export default function CreateTicket() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

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

  async function postNft2Rostra(nftInfo:cotaNFTType) {
    console.log("call create nft api!!")
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/nft/add/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nftInfo),
    })
      .then(async (resp) => {
        console.log("resp:", resp)
        const data = await resp.json()
        if (data.message == "SUCCESS") {
          console.log("values.name:", nftInfo.name)
        } else {
          throw Error("create new nft faild!")
        }
  })
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

    const defineLock = addressToScript(TEST_ADDRESS)

    const cotaInfo: CotaInfo = {
      name: values.name,
      description: values.description,
      image: 'ipfs://bafyreidq5eujpiq5fkygqtmiy7ansuyeujsvpnwieagekmr4y6gllzdsq4/metadata.json'
    }

    let { rawTx, cotaId: cId } = await generateDefineCotaTx(cotaService, defineLock, 100, '0x00', cotaInfo)
    cotaId = cId
    console.log(` ======> cotaId: ${cotaId}`)
    console.log(' ===================== secp256k1Dep ===================== ')
    const nftInfo: cotaNFTType = {
      name: values.name.trim(),
      desc: values.description.trim(),
      image: 'ipfs://bafyreidq5eujpiq5fkygqtmiy7ansuyeujsvpnwieagekmr4y6gllzdsq4/metadata.json',
      cota_id: cotaId,
      type: 1 // 1 - nft 2-ticket
    }

    postNft2Rostra(nftInfo)
    rawTx.cellDeps.push(secp256k1Dep)
    try {
      const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
      console.log(JSON.stringify(signedTx))
      let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
      console.info(`Define cota nft tx has been sent with tx hash ${txHash}`)
    } catch (error) {
      console.error('error happened:', error)
    }



    console.log("========> createNFT finished...")
  }


  
    

    // const apiKey: string = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || ""
    // if (!apiKey) return
    // const client = new NFTStorage({ token: apiKey })

    // const metadata = await client.store({
    //   name: values.name,
    //   description: values.description,
    //   image: fileObj as File,
    // })
    // const metadata = {
    //   url: 'ipfs://bafyreidq5eujpiq5fkygqtmiy7ansuyeujsvpnwieagekmr4y6gllzdsq4/metadata.json'
    // }
    // console.log("metadata.url: ", metadata.url)
    // setIpfsUrl(metadata.url)
    // const guildName = values.guildName
    // console.log("guildName: ", guildName)

    // setTimeout(() => {
    //   setIpfsUrl("")
    //   actions.setSubmitting(false)
    // }, 1000)
  

  return (
    <Formik
      initialValues={{ guildName: "", name: "", description: "", amount: 0 }}
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
          <Field name="amount">
            {({ field, form }: FieldProps) => (
              <FormControl
                isRequired
                isInvalid={!!(form.errors.guildName && form.touched.guildName)}
              >
                <FormLabel htmlFor="guildName">Amount</FormLabel>
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
                <FormErrorMessage>{form.errors.guildName}</FormErrorMessage>
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
  
  
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}


