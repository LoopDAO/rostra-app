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

export default function SettingPage() {
    const { t } = useTranslation()

    const { isLoggedIn: isLoggedInFlash, account: accountFlash } = useAccountFlashsigner()

    return (
      <Sidebar>
        reporting
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
