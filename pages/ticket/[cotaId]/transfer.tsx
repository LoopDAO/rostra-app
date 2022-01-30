import React, { useRef, ReactNode, useState } from "react"
import { FormControl, FormLabel, FormErrorMessage, Button, Textarea, Input } from "@chakra-ui/react"
import { Formik, Form, Field, FieldProps } from "formik"
import { GetStaticPaths, GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { getSecp256k1CellDep, padStr } from "@lib/utils/ckb"
import { addressToScript, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Service, Collector, Aggregator, generateMintCotaTx, MintCotaInfo, } from '@nervina-labs/cota-sdk'

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'

const secp256k1Dep = getSecp256k1CellDep(false)

const service: Service = {
  collector: new Collector({
    ckbNodeUrl: 'https://ckb-testnet.rebase.network/rpc', ckbIndexerUrl: 'https://testnet.ckbapp.dev/indexer'
  }),
  aggregator: new Aggregator({ registryUrl: 'http://cota-registry-aggregator.rostra.xyz', cotaUrl: 'http://cota-aggregator.rostra.xyz' }),
}
const ckb = service.collector.getCkb()

const cotaId = '0xd3b2bc022b52ce7282b354d97f9e5e5baf6698d7'

export default function SendTickets() {
  function validateTokenIndex(value?: string) {
    let error
    if (!value) {
      error = "Token index is required"
    }
    return error
  }

  function validateAddress(value?: string) {
    let error
    if (!value) {
      error = "Address is required"
    }
    return error
  }

  const onSubmit = async (values: { addresses: string, startIndex: string }, actions: any) => {
    console.log("values...", values)
    const { startIndex, addresses } = values
    console.log(` ======> cotaId: ${cotaId}`)
    const mintLock = addressToScript(TEST_ADDRESS)
    const addressesList: string[] = addresses.split("\n")
    console.log(` ======> addressesList: ${addressesList}`)
    let startIndexInt= parseInt(startIndex, 16);
    console.log('startIndexInt: ', startIndexInt)
    const withdrawals = addressesList.map((address, index) => {
      const tokenIndex = padStr((startIndexInt++).toString(16))
      console.log('tokenIndex: ', tokenIndex)
      return {
        tokenIndex,
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(address)),
      }
    })

    const mintCotaInfo: MintCotaInfo = {
      cotaId,
      withdrawals,
    }
    console.log('mintCotaInfo: ', mintCotaInfo)
    let rawTx = await generateMintCotaTx(service, mintLock, mintCotaInfo)

    rawTx.cellDeps.push(secp256k1Dep)

    const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
    console.log('signedTx: ', JSON.stringify(signedTx))
    let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
    console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
  }

  return (
    <Formik
      initialValues={{ addresses: '', startIndex: '0x00000000' }}
      onSubmit={onSubmit}
    >
      {(props) => (

        <Form>
          <Field name="startIndex" validate={validateTokenIndex}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isRequired
                isNumber
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel htmlFor="startIndex">Start Token Index(In Hex)</FormLabel>
                <Input {...field} id="startIndex" placeholder="0x00000000" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="addresses" validate={validateAddress}>
            {({ field, form }: FieldProps) => (
              <FormControl
                style={{ paddingTop: "10px" }}
                isRequired
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel htmlFor="addresses">Addresses</FormLabel>
                <Textarea
                  {...field}
                  id="addresses"
                  placeholder="Split by new line"
                />
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
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}
