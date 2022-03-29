import React, { useState } from "react"
import { AddIcon, DeleteIcon, TimeIcon } from "@chakra-ui/icons"
import { FormLabel, FormErrorMessage, Box, Button, Center, Flex, FormControl, Heading, HStack, IconButton, Image, Input, InputGroup, InputLeftAddon, Select, Spacer } from "@chakra-ui/react"
import { RuleType } from "api/rule_setting"
import { useTranslation } from "next-i18next"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import "react-datepicker/dist/react-datepicker.css"
import { Field, FieldProps, Form, Formik } from "formik"


const RuleAction: React.FunctionComponent<{ rule: RuleType; setTabIndex: any; setRuleInfo: any }> = ({
  rule,
  setTabIndex,
  setRuleInfo,
}) => {
  const { t } = useTranslation()
  const ruleInfo = rule

  const [typeValue, setTypeValue] = React.useState("discussion")
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    setTypeValue(event.target.value)
    switch (event.target.value) {
      case "github_discussion":
      case "github_commit":
      case "github_project":
        console.log("event.target.value: ", event.target.value)
        document.getElementById("twitter").value = ""
        document.getElementById("discord").value = ""

        break
      case "Tweet":
      case "Retweet":
      case "Follow":
      case "Hastag":
        document.getElementById("github").value = ""
        document.getElementById("discord").value = ""
        break
      case "Join":
      case "Send":
        document.getElementById("twitter")?.value = ""
        document.getElementById("github").value = ""
        break
    }
  }

  const onSubmit = async (values: any) => {
    const { url, address, keyword, startDate, endDate } = values

    ruleInfo.action.type = typeValue
    ruleInfo.action.url = url ?? ruleInfo.action.url

    ruleInfo.action.condition = [{ with: 'address', of: address }, { with: 'keyword', of: keyword }]

    ruleInfo.action.start_time = startDate
    ruleInfo.action.end_time = endDate
    console.log("rule", rule)
    setRuleInfo(rule)
    setTabIndex(2)
  }

  const formElem = (
    <Formik initialValues={{ url: "", keyword: "" }} onSubmit={onSubmit}>
      {(props) => (
        <Form>
          <Field
            name="url"
            style={{ paddingTop: "10px" }}
          >
            {({ field, form }: FieldProps) => (
              <FormControl
                style={{ paddingTop: "10px" }}
                isRequired
                isInvalid={!!(form.errors.url && form.touched.url)}
              >
                <FormLabel htmlFor="url">{t("URL")}</FormLabel>
                <Input {...field} id="url" />
                <FormErrorMessage>{form.errors.url}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="address">
            {({ field, form }: FieldProps) => (
              <FormControl
                style={{ paddingTop: "10px" }}
                isRequired
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel htmlFor="address">{t("Address")}</FormLabel>
                <Select
                  {...field}
                  id="of1"
                  placeholder="Nervos"
                  defaultValue={"Nervos"}
                  size="lg"
                  fontSize="xl"
                  width="100%"
                >
                  <option value="Nervos">Nervos</option>
                  <option value="Ethereum">Ethereum</option>
                </Select>
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field
            name="keyword"
            style={{ paddingTop: "10px" }}
          >
            {({ field, form }: FieldProps) => (
              <FormControl
                style={{ paddingTop: "10px" }}
                isRequired
                isInvalid={!!(form.errors.keyword && form.touched.keyword)}
              >
                <FormLabel htmlFor="keyword">{t("Keyword")}</FormLabel>
                <Input {...field} id="keyword" />
                <FormErrorMessage>{form.errors.keyword}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="startDate">
            {({ field, form }: FieldProps) => (
              <FormControl
                style={{ paddingTop: "10px" }}
                isRequired
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel htmlFor="startDate">{t("Start Date")}</FormLabel>
                <DatePicker
                  {...field}
                  selected={(field.value && new Date(field.value)) || null}
                  onChange={val => {
                    form.setFieldValue(field.name, val);
                  }}
                />

                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="endDate">
            {({ field, form }: FieldProps) => (
              <FormControl
                style={{ paddingTop: "10px" }}
                isRequired
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel htmlFor="endDate">{t("End Date")}</FormLabel>
                <DatePicker
                  {...field}
                  selected={(field.value && new Date(field.value)) || null}
                  onChange={val => {
                    form.setFieldValue(field.name, val);
                  }}
                />

                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <HStack spacing="2px" width="60%">
            <Box p="2" />
            <Button
              variant="with-shadow"
              bg="grey"
              color="white"
              size="sm"
              height="40px"
              width="100px"
              mr="1"
              onClick={setTabIndex.bind(null, 0)}
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
              {t("Next")}
            </Button>
          </HStack>

        </Form>
      )}
    </Formik>
  )
  return (
    <Box>
      <HStack spacing="2px" width="80%">
        <Image boxSize="30px" bg="white" color="white" alt="NFT" src="/image/github64.png" />
        <Select
          id="github"
          defaultValue={"discussion"}
          onChange={handleChange}
          variant="flushed"
          placeholder="Github"
          size="md"
          fontSize="xl"
          border="0px"
        >
          <option value="github_discussion" selected>
            Comment on this discussion
          </option>
          <option value="github_commit">Creat a commit</option>
          <option value="github_project">Star this project</option>
        </Select>
        <Box p={3} />
        <Image boxSize="30px" bg="white" alt="NFT" color="black" src="/image/twitter.png" />
        <Select
          id="twitter"
          defaultValue={"Retweet"}
          onChange={handleChange}
          placeholder="Twritter"
          variant="flushed"
          size="md"
          fontSize="xl"
          width="100%"
          border="0px"
        >
          <option value="Tweet">Tweet</option>
          <option value="Retweet">Retweet</option>
          <option value="Follow">Follow</option>
          <option value="Hastag">Hastag</option>
        </Select>

        <Box p={3} />
        <Image boxSize="30px" bg="white" alt="NFT" color="black" src="/image/discord.svg" />
        <Select
          id="discord"
          onChange={handleChange}
          variant="flushed"
          placeholder="Discord"
          size="md"
          fontSize="xl"
          width="100%"
          border="0px"
        >
          <option value="Join">Join a server</option>
          <option value="Send">Send message on a server</option>
        </Select>
      </HStack>
      <br />
      <FormControl as="fieldset" border="1px" color="gray" borderRadius="md" overflow="hidden">
        <Flex bg="black" h="80px" alignContent="center">
          <Box p={3} />
          <Center>
            <Image boxSize="30px" bg="block" alt="NFT" src="/image/github_light64.png" />
          </Center>
          <Center>
            <Box p="4">
              <Heading size="md" color="white">
                Comment on this discussion
              </Heading>
            </Box>
          </Center>
          <Spacer />
          <Center>
            <DeleteIcon
              w={7}
              h={7}
              color="white"
              onClick={() => {
                alert("Delete")
              }}
            />
            <Box p="3" />
          </Center>
        </Flex>
        <Box p="20px">
          {formElem}
        </Box>
      </FormControl>
    </Box>
  )
}

export default RuleAction