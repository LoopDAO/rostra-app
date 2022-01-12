import React from "react"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"
import { Button } from "../common/Button"
import { Tooltip } from "../common/Tooltip"
import { Switch } from "../common/Switch"

export const ThemeToggle = (props: React.ComponentProps<typeof Button>) => {
  const { theme, setTheme } = useTheme()
  const newTheme = theme === "dark" ? "light" : "dark"

  return (
    <Tooltip label={`Change to ${newTheme} theme`}>
      <Switch
        onClick={() => {
          setTheme(newTheme)
        }}
        {...props}
        aria-label="toggle a light and dark color scheme"
        size="2"
      >
        {theme === "dark" ?  <MoonIcon /> : <SunIcon />}
      </Switch>
    </Tooltip>
  )
}
