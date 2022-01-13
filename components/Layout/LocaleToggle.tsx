import React from "react"
import { useTranslation } from "next-i18next"

import { Button } from "../common/Button"
import { Tooltip } from "../common/Tooltip"
import { Switch } from "../common/Switch"

export const LocaleToggle = (props: React.ComponentProps<typeof Button>) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as "zh" | "en"
  const newLocale = locale === "zh" ? "en" : "zh"

  return (
    <Tooltip label={`Change to ${newLocale}`}>
      <Switch
        onClick={() => {
          i18n.changeLanguage(newLocale)
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
