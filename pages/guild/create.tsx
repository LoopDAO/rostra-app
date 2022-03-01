import React, { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { useWeb3React } from "@web3-react/core"
import { GuildType } from "api/guild"
import { Heading } from "@components/common/Heading"
import { Web3Provider } from "@ethersproject/providers"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/react"
import { Formik, Form, Field, FieldProps } from "formik"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { getNftManagerContract } from "@lib/utils/contracts"
import { saveToIpfs } from "@components/IPFS/saveToIpfs"

export default function CreateGuild() {
  const { t } = useTranslation()

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

  const { account, library, chainId } = useWeb3React<Web3Provider>()
  const onSubmit = async (values: GuildType) => {
    console.log("values: ", values)
    const { name, desc } = values
    if (!library || !account) return
    const guildInfo: GuildType = {
      name: name.trim(),
      desc: desc.trim(),
      creator: account,
    };
    const ipfsAddr = await saveToIpfs(guildInfo)
    console.log("IPFS Address:", ipfsAddr);
    if (ipfsAddr.length) {
      guildInfo['ipfsAddr'] = ipfsAddr
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/add/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guildInfo),
      })
        .then(async (resp) => {
          const signer = library.getSigner(account)
          const nftManager = getNftManagerContract(signer, chainId)
          await nftManager.connect(signer).createGuild(values.name, "", [])
          const data = await resp.json()
          if (data.message == "SUCCESS") {
            console.log("values.name:", values.name)
          } else {
            throw Error("create new guild faild!")
          }
        })
        .then(console.log)
        .catch(console.log)
    } else {
      console.log("Failed to save to IPFS")
    }
  }

  return (
    <div>
      <Heading>{t("guild.create")}</Heading>
      <Formik initialValues={{ name: "", desc: "" }} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            <Field
              name="name"
              style={{ paddingTop: "10px" }}
              validate={validateName}
            >
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
                  isInvalid={!!(form.errors.name && form.touched.name)}
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
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
