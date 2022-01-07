import React from "react"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"
import { Button } from "./Button"

export const ThemeToggle = (props: React.ComponentProps<typeof Button>) => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
      }}
      {...props}
      aria-label="toggle a light and dark color scheme"
      size="1"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
