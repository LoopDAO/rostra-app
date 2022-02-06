import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { GuildListType } from "api/guild"
import { Heading } from "@components/common/Heading"
import { Web3Provider } from "@ethersproject/providers"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/react"
import { Formik, Form, Field } from "formik"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { getNftManagerContract } from "@lib/utils/contracts"

export default function CreateGuild() {
  const { t } = useTranslation()

  function validateName(value) {
    let error
    if (!value) {
      error = "Name is required"
    }
    return error
  }

  function validateDescription(value) {
    let error
    if (!value) {
      error = "Description is required"
    }
    return error
  }

  const { account, library, chainId } = useWeb3React<Web3Provider>()
  const onSubmit = async (values, actions) => {
    console.log('values: ', values)
    if (!library || !account) return
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/add/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          ...values,
          creator: account,
          // signature: 'sig',
          // members: [],
          // requirements: []
        }
      ),
    })
      .then(async (resp) => {
        const signer = await library.getSigner(account)
        const nftManager = getNftManagerContract(signer, chainId)
        await nftManager.connect(signer).createGuild(values.name, '', [])
        const data = await resp.json()
        if (data.message == "SUCCESS") {
          console.log('values.name:', values.name)
        } else {
          throw Error("create new guild faild!")
        }
      })
      .then(console.log)
      .catch(console.log)
  }

  return (
    <div>
    <Heading>{t("guild.create")}</Heading>
    <Formik
      initialValues={{ name: "", desc: "" }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors.name && form.touched.name}
              >
                <FormLabel htmlFor="name">{t("guild.name")}</FormLabel>
                <Input {...field} id="name" placeholder="Name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="desc" validate={validateDescription}>
            {({ field, form }) => (
              <FormControl
                isRequired
                isInvalid={form.errors.name && form.touched.name}
              >
                <FormLabel htmlFor="desc">{t("guild.desc")}</FormLabel>
                <Input {...field} id="desc" placeholder="Description" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
  </div>)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
