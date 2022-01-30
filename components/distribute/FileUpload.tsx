import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Code,
  Icon,
} from "@chakra-ui/react"
import { FiFile } from "react-icons/fi"
import { Control, useController } from "react-hook-form"
import { ReactNode, useRef } from "react"

type FileUploadProps = {
  name: string
  placeholder: string
  acceptedFileTypes: string
  control: Control
  children: ReactNode
  isRequired?: boolean
}

const FileUpload = ({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  isRequired = false,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  })

  return (
    <FormControl isInvalid={invalid} isRequired>
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiFile} />
        </InputLeftElement>
        <input
          type="file"
          accept={acceptedFileTypes}
          ref={inputRef}
          {...inputProps}
          style={{ display: "none" }}
        ></input>
        <Input
          placeholder={placeholder || "Your file ..."}
          onClick={() => inputRef.current?.click()}
          value={value}
        />
      </InputGroup>
      <FormErrorMessage>{invalid}</FormErrorMessage>
    </FormControl>
  )
}

export default FileUpload
