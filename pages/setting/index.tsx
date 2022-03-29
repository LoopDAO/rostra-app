import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import RuleAction from "@components/setting/RuleAction"
import RuleBaseInfo from "@components/setting/RuleBaseInfo"
import RuleNFT from "@components/setting/RuleNFT"
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { RuleType } from "api/rule_setting"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import ErrorPage from "pages/ErrorPage"
import SuccessPage from "pages/SuccessPage"
import React, { useState } from "react"
import Sidebar from "@components/Layout/Sidebar"

const initRuleInfo = {
  rule_id: undefined,
  name: "",
  desc: "",
  ipfsAddr: "",
  wallet_address: undefined,
  creator: "",
  signature: undefined,
  action: {
    type: "Comment on this discussion",
    url: "https://github.com",
    condition: [{ with: "Address", of: "Nervos" }],
    start_time: new Date(),
    end_time: new Date(),
  },
  nft: {
    name: "",
    desc: "",
    image: "",
  },
}
export default function SettingPage() {
  const { t } = useTranslation()

  const { isLoggedIn: isLoggedInFlash, account: accountFlash } = useAccountFlashsigner()

  const [ruleInfo, setRuleInfo] = useState<RuleType>(initRuleInfo)
  const [tabIndex, setTabIndex] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  if (!isLoggedInFlash) {
    return <div>{"You need to login to create a rule"}</div>
  }

  if (errorMessage) {
    return <ErrorPage message={JSON.parse(errorMessage).message} />
  }
  if (successMessage) {
    return <SuccessPage message={successMessage} title={"Success"} />
  }

  console.log("tabIndex: ", tabIndex)
  const handleTabsChange = (index: React.SetStateAction<number>) => {
    // setTabIndex(index)
  }
  const postRule2Rostra = async (ruleInfo: RuleType) => {
    ruleInfo.creator = accountFlash.address
    ruleInfo.signature = "test"

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rostra/rule/add/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ruleInfo),
    })
      .then(async (resp) => {
        console.log("resp:", resp)
        if (resp.status === 200 || resp.status === 201) {
          setSuccessMessage("Rule is set successfully!")
        } else {
          setErrorMessage(await resp.text())
        }
      })
      .then(console.log)
      .catch(console.log)
  }
  return (
    <Sidebar>
      <Tabs onChange={handleTabsChange} index={tabIndex}>
        <TabList>
          <Tab>{t("setting.RuleBase")}</Tab>
          <Tab>{t("setting.RuleAction")}</Tab>
          <Tab>{t("setting.RuleNFT")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>
              <RuleBaseInfo rule={ruleInfo} setTabIndex={setTabIndex} setRuleInfo={setRuleInfo} />
            </p>
          </TabPanel>
          <TabPanel>
            <p>
              <RuleAction rule={ruleInfo} setTabIndex={setTabIndex} setRuleInfo={setRuleInfo} />
            </p>
          </TabPanel>
          <TabPanel>
            <p>
              <RuleNFT rule={ruleInfo} postRule={postRule2Rostra} />
            </p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Sidebar>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
