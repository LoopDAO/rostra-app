import React, { useRef, ReactNode, useState } from "react"
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

export default function CreateRedPacket() {
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
  function validateGuildName(value: string) {
    let error
    if (!value) {
      error = "Guild Name is required"
    }
    return error
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

  const { account, library, chainId } = useWeb3React<Web3Provider>()
  // @ts-expect-error TODO: Add typings
  const onSubmit = async (values, actions) => {
    console.log("values...", values)
    const apiKey: string = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || ""
    if (!apiKey) return
    const client = new NFTStorage({ token: apiKey })

    if (!library || !account) return
    const signer = await library.getSigner(account)
    const nftManager = getNftManagerContract(signer, chainId)
    if (!nftManager) return
    console.log("values: ", values)
    const metadata = await client.store({
      name: values.name,
      description: values.description,
      image: fileObj as File,
    })
    // const metadata = {
    //   url: 'ipfs://bafyreidq5eujpiq5fkygqtmiy7ansuyeujsvpnwieagekmr4y6gllzdsq4/metadata.json'
    // }
    console.log("metadata.url: ", metadata.url)
    setIpfsUrl(metadata.url)
    const guildName = values.guildName
    console.log("guildName: ", guildName)

    const guildId = await nftManager.guildNameToGuildId(guildName)
    console.log("guildId: ", guildId)
    if (guildId === ZERO_GUILD_ID) {
      alert(`No guild id found for guild name: ${guildName}`)
      return
    }
    // await nftManager.connect(signer).mintNewNFT(guildId, metadata.url, addresses);

    setTimeout(() => {
      setIpfsUrl("")
      actions.setSubmitting(false)
    }, 1000)
  }

  return (
    <Formik
      initialValues={{ guildName: "", name: "", description: "", amount: 0 }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <Field name="guildName" validate={validateGuildName}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isRequired
                isInvalid={!!(form.errors.guildName && form.touched.guildName)}
              >
                <FormLabel htmlFor="guildName">Guild Name</FormLabel>
                <Input {...field} id="guildName" placeholder="Guild Name" />
                <FormErrorMessage>{form.errors.guildName}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
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
