import React, { useRef, ReactNode, useState } from "react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Textarea,
    Button,
    Icon,
    InputGroup
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik';
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { FiFile } from 'react-icons/fi'
import { NFTStorage, File } from 'nft.storage'

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE0RUIwNWMzRjFBYWE1ODg5NTVlMjIxY0Q2ODNCOTIxY0U5QTU0NTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MDI2NzY2OTgxOSwibmFtZSI6InJvc3RyYSJ9._VrBWiE5YkB3eDwl0N6PZoOC4fxN2pCwcHgRIuGqsBo';
const client = new NFTStorage({ token: apiKey })

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode,
  onChange?: Function
}

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children, onChange } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register as {ref: (instance: HTMLInputElement | null) => void}

  const handleClick = () => inputRef.current?.click()

  return (
      <InputGroup onClick={handleClick}>
        <input
          type={'file'}
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
        <>
          {children}
        </>
      </InputGroup>
  )
}


export default function FormikExample() {

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const [ipfsUrl, setIpfsUrl] = useState('');
  const [fileObj, setFileObj] = useState<File>();

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return 'Files is required'
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024)
      const MAX_FILE_SIZE = 10
      if (fsMb > MAX_FILE_SIZE) {
        return 'Max file size 10mb'
      }
    }
    return true
  }
  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    }
    return error
  }

  function validateDescription(value) {
    let error
    if (!value) {
      error = 'Description is required'
    }
    return error
  }

   function validateImage(value) {
    let error
    if (!value) {
      error = 'Image is required'
    }
    return error
  }

  function validateAddress(value) {
    let error
    if (!value) {
      error = 'Address is required'
    }
    return error
  }

  async function onFileChanged(e) {
      console.log(e.target.files);
      const file = e.target.files[0];
      if (!file) return;
      console.log(file.name, file.type);
      setFileObj(e.target.files[0]);
  }
  console.log('fileObj: ', fileObj)

  // const onSubmit = handleSubmit((data) => console.log('On Submit: ', data))

  const onSubmit = async (values, actions) => {
    console.log('values: ', values)
    // const metadata = await client.store({
    //   name: values.name,
    //   description: values.description,
    //   image: fileObj as File
    // })
    const metadata = {
      url: 'ipfs://bafyreigtaeq3onyvlsg7chafu2oarnb4afkacl6jcbassjcygi4rvlpvry/metadata.json'
    }
    console.log(metadata.url)
    setIpfsUrl(metadata.url);
    const addresses = values.address.split('\n')
    console.log('addresses: ', addresses)
    console.log('onSubmit: call contract =======>')
    setTimeout(() => {
      actions.setSubmitting(false)
    }, 1000)
  }
  return (
    <Formik
      initialValues={{ name: '', description: '', address: '' }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor='name'>name</FormLabel>
                <Input {...field} id='name' placeholder='name' />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name='description' validate={validateDescription}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor='description'>Description</FormLabel>
                <Input {...field} id='description' placeholder='Description' />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
            <FormControl isInvalid={!!errors.file_} isRequired>
                <FormLabel>{'Image'}</FormLabel>
                <FileUpload
                    accept={'image/*'}
                    multiple
                    register={register('file_', { validate: validateFiles })}
                    onChange={(e) => {
                        onFileChanged(e)
                    }}
                >
                    <Button leftIcon={<Icon as={FiFile} />}>
                        Upload { ipfsUrl}
                    </Button>
                </FileUpload>

                <FormErrorMessage>
                    {errors.file_ && errors?.file_.message}
                </FormErrorMessage>
            </FormControl>
          <Field name='address' validate={validateAddress}>
            {({ field, form }) => (
              <FormControl isRequired isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor='address'>Address</FormLabel>
                <Textarea {...field} id='address' placeholder='address1,address2,address3' />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme='teal'
            isLoading={props.isSubmitting}
            type='submit'
          >
            Confirm
          </Button>
        </Form>
      )}
    </Formik>
  )
}