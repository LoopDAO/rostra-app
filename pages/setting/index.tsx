import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import Loading from "@components/Loading"
import RuleAction from "@components/setting/RuleAction"
import RuleBaseInfo from '@components/setting/RuleBaseInfo'
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import fetchers from "api/fetchers"
import { RuleType } from 'api/rule_setting'
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { useState } from "react"
import useSWR from "swr"

const initRuleInfo =
{
  rule_id: undefined,
  name: 'aaa',
  desc: '',
  ipfsAddr: undefined,
  wallet_address: undefined,
  creator: undefined,
  signature: undefined,
  action: {
    type: 'Comment on this discussion',
    url: 'https://github.com',
    condition: [{ "with": "Address", "of": "Nervos" }],
    start_time: new Date(),
    end_time: new Date(),
  },
  nft: {
    name: '',
    desc: '',
    image: ''
  }
}
export default function SettingPage() {
  const { t } = useTranslation()
  const { account } = useWeb3React<Web3Provider>()
  const [checked, setChecked] = useState(false)
  const [ruleInfo, setRuleInfo] = useState<RuleType>(initRuleInfo)

  const {
    data: itemsData,
    error: itemsError,
    isValidating: isLoadingData,
  } = useSWR(
    () => `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/`,
    fetchers.http
  )

  const {
    data: userItemsData,
    error: userItemsError,
    isValidating: isLoadingUserItems,
  } = useSWR(
    () =>
      account
        ? `${process.env.NEXT_PUBLIC_API_BASE}/rostra/guild/get/${account}`
        : null,
    fetchers.http
  )

  const onSubmit = async (values: RuleType) => {
    console.log("values: ", values)
    const { name, desc } = values
    console.log("name: ", name)
    console.log("desc: ", desc)
  }
  const itemList = checked ? userItemsData?.result : itemsData?.result

  if (itemsError || userItemsError)
    return <div>{itemsError?.message || userItemsError?.message}</div>

  if (isLoadingData || isLoadingUserItems) return <Loading />



  return (
    <Tabs defaultIndex={1}>
      <TabList>
        <Tab>{t('setting.RuleBase')}</Tab>
        <Tab>{t('setting.RuleAction')}</Tab>
        <Tab>Three</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p><RuleBaseInfo info={initRuleInfo} /></p>
        </TabPanel>
        <TabPanel>
          <p><RuleAction info={initRuleInfo} /></p>
        </TabPanel>
        <TabPanel>
          <p>three</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
