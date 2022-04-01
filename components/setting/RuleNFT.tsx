import { Button, FormControl, FormErrorMessage, FormLabel, Box, Input, InputGroup } from "@chakra-ui/react"
import { RuleType } from "api/rule_setting"
import { Field, FieldProps, Form, Formik } from "formik"
import { useTranslation } from "next-i18next"
import React, { ReactNode, useRef, useState } from "react"
import { useForm, UseFormRegisterReturn } from "react-hook-form"

const RuleNFT: React.FunctionComponent<{ rule: RuleType; setTabIndex: any; postRule: any }> = ({ rule, setTabIndex, postRule }) => {
  const { t } = useTranslation()
  const ruleInfo = rule
  const onSubmit = async (values: any) => {
    console.log("values: ", values)
    ruleInfo.nft = values.nft
    console.log("ruleInfo: ", ruleInfo)
    postRule(ruleInfo)
  }
  function validateName(value: string) {
    let error
    if (!value) {
      error = "Address is required"
    }
    return error
  }

  return (
    <div>
      <Formik onSubmit={onSubmit} initialValues={{ nft: rule.nft }}>
        {() => (
          <Form>
            <Field name="nft" style={{ paddingTop: "10px" }} validate={validateName}>
              {({ field, form }: FieldProps) => (
                <FormControl
                  style={{ paddingTop: "10px" }}
                  isRequired
                  isInvalid={!!(form.errors.nft && form.touched.nft)}
                >
                  <FormLabel htmlFor="nft">{t("Address")}</FormLabel>
                  <Input {...field} id="nft" />
                  <FormErrorMessage>{form.errors.nft}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box mt={4}>
              <Button
                variant="with-shadow"
                bg="grey"
                color="white"
                size="sm"
                height="40px"
                width="100px"
                mr="1"
                onClick={setTabIndex.bind(null, 1)}
              >
                {t("Prev")}
              </Button>

              <Button
                variant="with-shadow"
                bg="#3399ff"
                color="white"
                size="sm"
                height="40px"
                width="100px"
                type="submit"
              >
                {t("Save")}
              </Button>
          </Box>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RuleNFT
