import * as React from "react"
import { UpdateIcon } from "@radix-ui/react-icons"
import { keyframes, styled } from "stitches.config"
import { Box } from "@components/common/Box"

const spin = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
})

const Spinner = styled(UpdateIcon, {
  animation: `${spin} 1s linear infinite`,
})

type ButtonSpinnerProps = React.ComponentProps<typeof Box> & {
  label?: string
  placement?: "start" | "end"
}

export const ButtonSpinner: React.FC<ButtonSpinnerProps> = (props) => {
  const {
    label,
    placement,
    children = <Spinner color="currentColor" width="1em" height="1em" />,
    className,
    css,
    ...rest
  } = props

  const marginProp = placement === "start" ? "marginEnd" : "marginStart"

  const spinnerStyles = React.useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      position: label ? "relative" : "absolute",
      [marginProp]: label ? "0.5rem" : 0,
      fontSize: "1em",
      lineHeight: "normal",
      ...css,
    }),
    [css, label, marginProp]
  )

  return (
    <Box {...rest} css={spinnerStyles}>
      {children}
    </Box>
  )
}
