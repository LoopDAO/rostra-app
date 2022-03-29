import { AddIcon, DeleteIcon, TimeIcon } from "@chakra-ui/icons"
import { Alert, Box, Button, Center, Flex, FormControl, Heading, HStack, IconButton, Image, Input, InputGroup, InputLeftAddon, Select, Spacer } from "@chakra-ui/react"
import { RuleType } from "api/rule_setting"
import { Field, Form } from "formik"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import "react-datepicker/dist/react-datepicker.css"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"


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
  const [withList, setWithList] = useState([] as string[])
  const [withListId, setWithListId] = useState(1)
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

  const withListClick = () => {
    const list = withList
    console.log("list", list)
    list.push("")
    console.log("list", list)
    setWithList(list)
    setWithListId(list.length)
    return list
  }

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
            size="lg"
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
            size="lg"
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
            size="lg"
            fontSize="xl"
            width="100%"
            border="0px"
          >
            <option value="Join">Join a server</option>
            <option value="Send">Send message on a server</option>
          </Select>
        </HStack>
        <br />
        <FormControl as="fieldset" border="1px" color="gray" borderRadius="lg" overflow="hidden">
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
          <InputGroup size="lg">
            <InputLeftAddon bg="white" width="70px" color="black" border="0px">
              RUL
            </InputLeftAddon>
            <Input id="url" placeholder="input discussion url" defaultValue={ruleInfo.action.url} />
          </InputGroup>
          <br />
          <HStack spacing="2px" width="60%">
            <InputGroup size="lg">
              <InputLeftAddon bg="white" width="70px" color="black" border="0px">
                With
              </InputLeftAddon>
              <Select
                id="with1"
                defaultValue={"Address"}
                placeholder="Address"
                size="lg"
                fontSize="xl"
                width="100%"
              >
                <option value="Address">Address</option>
                <option value="Keyword">Keyword</option>
              </Select>
            </InputGroup>
            <InputGroup size="lg">
              <InputLeftAddon bg="white" width="50px" color="black" border="0px">
                of
              </InputLeftAddon>
              <Select
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
            </InputGroup>
          </HStack>
          <br />
          <HStack spacing="2px" width="67%">
            <InputGroup size="lg">
              <InputLeftAddon bg="white" width="70px" color="black" border="0px">
                With
              </InputLeftAddon>
              <Select
                defaultValue="Keyword"
                id="with2"
                placeholder=""
                size="lg"
                fontSize="xl"
                width="100%"
              >
                <option value="Address">Address</option>
                <option value="Keyword">Keyword</option>
              </Select>
            </InputGroup>
            <InputGroup size="lg">
              <InputLeftAddon bg="white" width="50px" color="black" border="0px">
                of
              </InputLeftAddon>
              <Input id="of2" defaultValue={"GM"} placeholder="GM" size="lg" fontSize="xl" width="100%" />
            </InputGroup>
            <AddIcon w={6} h={6} width="10%" onClick={() => withListClick()} />
          </HStack>
          {withList.map((data, index) => (
            <>
              <br />
              <HStack spacing="2px" width="60%">
                <InputGroup size="lg">
                  <InputLeftAddon bg="white" width="70px" color="black" border="0px">
                    With
                  </InputLeftAddon>
                  <Select
                    defaultValue={"Address"}
                    id="with-"
                    {...index}
                    placeholder="Address"
                    size="lg"
                    fontSize="xl"
                    width="100%"
                  >
                    <option value="Address">Address</option>
                    <option value="Keyword">Keyword</option>
                  </Select>
                </InputGroup>
                <InputGroup size="lg">
                  <InputLeftAddon bg="white" width="50px" color="black" border="0px">
                    of
                  </InputLeftAddon>
                  <Input
                    id="of-"
                    {...index}
                    placeholder={data}
                    size="lg"
                    fontSize="xl"
                    width="100%"
                  />
                </InputGroup>
              </HStack>
            </>
          ))}
          <br />

          <HStack spacing="2px" width="60%">
            <InputGroup size="lg">
              <InputLeftAddon bg="white" width="145px" color="black" border="0px">
                With Duration
              </InputLeftAddon>
              <IconButton
                colorScheme="white"
                color={"gray.300"}
                aria-label="Call Segun"
                size="lg"
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
            <InputGroup size="lg">
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