import { AddIcon, DeleteIcon, TimeIcon } from "@chakra-ui/icons"
import { Alert, Box, Button, Center, Flex, FormControl, Heading, HStack, IconButton, Image, Input, InputGroup, InputLeftAddon, Select, Spacer } from "@chakra-ui/react"
import { RuleType } from "api/rule_setting"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import "react-datepicker/dist/react-datepicker.css"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Field, FieldProps, Form, Formik } from "formik"


const RuleAction: React.FunctionComponent<{ rule: RuleType; setTabIndex: any; setRuleInfo: any }> = ({
  rule,
  setTabIndex,
  setRuleInfo,
}) => {
  const { t } = useTranslation()
  const ruleInfo = rule

  const router = useRouter()
  const [startDate, setStartDate] = useState(new Date(ruleInfo.action.start_time))
  const [endDate, setEndDate] = useState(new Date(ruleInfo.action.end_time))
  const [withList, setWithList] = useState(['0'] as string[])
  //const { action: rule_action } = action
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

  const addRuleItem = () => {
    const list = [...withList, withList.length.toString()]
    console.log("list", list)
    setWithList(list)
  }

  const removeRuleItem = (i: any) => {
    console.log('i: ', i)
    let list = [...withList];
    console.log("111 list", list)
    list.splice(i, 1);
    console.log("222 list", list)
    setWithList(list)
  }

  const listElem = withList.map((data, index) => {
    const isLastItem = withList.length - 1 === index
    const addBtn = isLastItem ? <AddIcon w={6} h={6} width="10%" onClick={() => addRuleItem()} /> : null
    return (
      <Box key={`${data}~${'rostra'}`}>
      <HStack spacing="2px" width="60%">
        <InputGroup size="md">
          <InputLeftAddon bg="white" width="70px" color="black" border="0px">
            With
          </InputLeftAddon>
          <Select
            defaultValue={"Address"}
            id={`with-${index}`}
            {...index}
            placeholder="Address"
            size="md"
            fontSize="xl"
            width="150px"
          >
            <option value="Address">Address</option>
            <option value="Keyword">Keyword</option>
          </Select>
        </InputGroup>
        <InputGroup size="md">
          <InputLeftAddon bg="white" width="50px" color="black" border="0px">
            of
          </InputLeftAddon>
          <Input
            id="of-"
            {...index}
            size="md"
            fontSize="xl"
            width="200px"
          />
        </InputGroup>
        {!!index && <DeleteIcon w={7} h={7} color="black" onClick={() => removeRuleItem(index) } />}
      </HStack>
      {addBtn}
    </Box>)
  })

  const submitContact = async (event: any) => {
    event.preventDefault()

    const url = event.target.url.value
    const with1 = event.target.with1.value
    const of1 = event.target.of1.value
    const with2 = event.target.with2.value
    const of2 = event.target.of2.value

    ruleInfo.action.type = typeValue
    ruleInfo.action.url = url ?? ruleInfo.action.url

    //if (with1 && of1) ruleInfo.action.condition.push({ with: with1, of: of1 })
    if (with2 && of2) ruleInfo.action.condition.push({ with: with2, of: of2 })

    ruleInfo.action.start_time = startDate
    ruleInfo.action.end_time = endDate
    console.log("rule", rule)
    setRuleInfo(rule)
    setTabIndex(2)
  }

  console.log("withList", withList)
  console.log("typeValue", typeValue)

  return (
    <>
      <form id="formAction" onSubmit={submitContact}>
        <br />
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

          <br />
          <InputGroup size="md">
            <InputLeftAddon bg="white" width="70px" color="black" border="0px">
              URL
            </InputLeftAddon>
            <Input id="url" placeholder="input discussion url" defaultValue={ruleInfo.action.url} />
          </InputGroup>

          <HStack spacing="2px" width="60%">
            <InputGroup size="md">
              <InputLeftAddon bg="white" width="145px" color="black" border="0px">
                With Duration
              </InputLeftAddon>
              <IconButton
                colorScheme="white"
                color={"gray.300"}
                aria-label="Call Segun"
                size="md"
                icon={<TimeIcon />}
              />
              <Center>
                <DatePicker
                  id="start_time"
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                />
              </Center>
            </InputGroup>
            <InputGroup size="md">
              <InputLeftAddon bg="white" width="50px" color="black" border="0px">
                {" "}
                -{" "}
              </InputLeftAddon>
              <Center>
                <DatePicker
                  id="end_time"
                  selected={endDate}
                  onChange={(date: Date) => setEndDate(date)}
                />
              </Center>
            </InputGroup>
          </HStack>
          {listElem}
          <br />
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

          <br />
        </FormControl>
      </form>
    </>
  )
}

export default RuleAction