import React from "react"
import { useTranslation } from "next-i18next"
import { Button } from "../common/Button"
import { Tooltip } from "../common/Tooltip"
import { Switch } from "../common/Switch"
import { useRouter } from "next/router"

const LocaleToggle = (props: React.ComponentProps<typeof Button>) => {
  const { i18n } = useTranslation()
  const router = useRouter()

  const locale = i18n.language as "zh" | "en"
  const newLocale = locale === "zh" ? "en" : "zh"
  const { pathname, asPath, query } = router
  return (
    <Tooltip label={`Change to ${newLocale}`}>
      <Switch
        onClick={() => {
          i18n.changeLanguage(newLocale)
          // change just the locale and maintain all other route information including href's query
          router.push({ pathname, query }, asPath, { locale: newLocale })
        }}
        {...props}
        aria-label="toggle to ZH or EN locale"
        size="2"
      >
        {locale}
      </Switch>
    </Tooltip>
  )
}

export default LocaleToggle