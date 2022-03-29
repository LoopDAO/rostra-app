import { Button, FormControl, FormErrorMessage, FormLabel, Icon, Input, InputGroup } from "@chakra-ui/react"
import { RuleType } from "api/rule_setting"
import { Field, FieldProps, Form, Formik } from "formik"
import { useTranslation } from "next-i18next"
import React, { ReactNode, useRef, useState } from "react"
import { useForm, UseFormRegisterReturn } from "react-hook-form"
import { FiFile } from "react-icons/fi"

const RuleNFT: React.FunctionComponent<{ rule: RuleType; postRule: any }> = ({ rule, postRule }) => {
  const { t } = useTranslation()
  const ruleInfo = rule
  const [ipfsUrl, setIpfsUrl] = useState("")
  const [fileObj, setFileObj] = useState<File>()
  const {
    register,
    formState: { errors },
  } = useForm()

  const onSubmit = async (values: RuleType["nft"]) => {
    console.log("values: ", values)
    ruleInfo.nft = values
    ruleInfo.nft.image = "https://rostra.xyz/image/nft/nft219.png"
    console.log("ruleInfo: ", ruleInfo)
    postRule(ruleInfo)
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
  type FileUploadProps = {
    register: UseFormRegisterReturn
    accept?: string
    multiple?: boolean
    children?: ReactNode
    onChange?: React.ChangeEventHandler<HTMLInputElement>
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
  return (
    <div>
      <Formik initialValues={ruleInfo.nft} onSubmit={onSubmit}>
        {() => (
          <Form>
            <Field name="name" style={{ paddingTop: "10px" }} validate={validateName}>
              {({ field, form }: FieldProps) => (
                <FormControl
                  style={{ paddingTop: "10px" }}
                  isRequired
                  isInvalid={!!(form.errors.name && form.touched.name)}
                >
                  <FormLabel htmlFor="name">{t("guild.name")}</FormLabel>
                  <Input {...field} id="name" placeholder="Name" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="desc" validate={validateDescription}>
              {({ field, form }: FieldProps) => (
                <FormControl
                  style={{ paddingTop: "10px" }}
                  isRequired
                  isInvalid={!!(form.errors.desc && form.touched.desc)}
                >
                  <FormLabel htmlFor="desc">{t("guild.desc")}</FormLabel>
                  <Input {...field} id="desc" placeholder="Description" />
                  <FormErrorMessage>{form.errors.desc}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <br />

            <FormControl isInvalid={!!errors.image} isRequired>
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

              <FormErrorMessage>{errors.file_ && errors?.file_.message}</FormErrorMessage>
            </FormControl>

            <br />

            <Button
              variant="with-shadow"
              bg="#3399ff"
              color="white"
              size="lg"
              height="60px"
              type="submit"
              width="200px"
            >
              {t("Save")}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RuleNFT
