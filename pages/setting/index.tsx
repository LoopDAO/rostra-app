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
import React, { useState, useEffect } from "react"
import Sidebar from "@components/Layout/Sidebar"
import { addressToScript, serializeWitnessArgs, scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import {
  signMessageWithRedirect,
  appendSignatureToTransaction,
  Config,
  transactionToMessage,
  generateFlashsignerAddress,
  ChainType,
  getResultFromURL
} from '@nervina-labs/flashsigner'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import { generateDefineCotaTx, CotaInfo, } from '@nervina-labs/cota-sdk'
import Link from "next/link"
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"

const chainType = process.env.CHAIN_TYPE || 'testnet'
Config.setChainType(chainType as ChainType)

const initRuleInfo = {
  name: "",
  desc: "",
  wallet_address: undefined,
  creator: "",
  signature: undefined,
  action: {
    type: "Comment on this discussion",
    url: "",
    condition: [{ with: "Address", of: "Nervos" }],
    start_time: new Date(),
    end_time: new Date(),
  },
  nft: "",
}
export default function SettingPage() {
  const { t } = useTranslation()
  const { isLoggedIn, account } = useAccountFlashsigner()
  const [ruleInfo, setRuleInfo] = useState<RuleType>(initRuleInfo)
  const [tabIndex, setTabIndex] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [registered, setRegistered] = useState(false)

  const cotaAddress = generateFlashsignerAddress(account.auth.pubkey)
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const res = await cotaService.aggregator.checkReisteredLockHashes([
          scriptToHash(addressToScript(cotaAddress)),
        ])
        setRegistered(res?.registered);
        console.log('res: ', res)
      }
    };
    fetchData();
  }, [cotaAddress, isLoggedIn]);

  if (!isLoggedIn) {
    return <div>{"You need to login to create a rule"}</div>
  }

  if (!registered) {
    return (
      <>
        <Link href={'/dashboard'}>{t('nft.resitryWarning')}</Link>
      </>
    )
  }

  let errorMessageElem, successMessageElem
  if (errorMessage) {
    errorMessageElem = <ErrorPage message={JSON.parse(errorMessage).message} />
  }
  if (successMessage) {
    successMessageElem = <SuccessPage message={successMessage} title={"Success"} />
  }

  const postRule2Rostra = async (ruleInfo: RuleType) => {
    ruleInfo.creator = account.address
    ruleInfo.signature = "test"

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rule/add/`, {
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
  const tabStyle = { color: 'white', bg: 'blue.500' }
  return (
    <Sidebar>
      {errorMessageElem}
      {successMessageElem}
      <Tabs index={tabIndex}>
        <TabList>
          <Tab _selected={tabStyle}>{t("setting.RuleBase")}</Tab>
          <Tab _selected={tabStyle}>{t("setting.RuleAction")}</Tab>
          <Tab _selected={tabStyle}>{t("setting.RuleNFT")}</Tab>
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
              <RuleNFT rule={ruleInfo} setTabIndex={setTabIndex} postRule={postRule2Rostra} />
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
