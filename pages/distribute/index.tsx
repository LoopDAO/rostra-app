import React, { useRef, ReactNode } from "react";
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

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode
}

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children } = props
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
        />
        <>
          {children}
        </>
      </InputGroup>
  )
}


export default function FormikExample() {

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  
  const onSubmit = handleSubmit((data) => console.log('On Submit: ', data))

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

  return (
    <Formik
      initialValues={{ name: '', description: '', image: '', address: '' }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
      }}
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
                >
                    <Button leftIcon={<Icon as={FiFile} />}>
                        Upload
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