import { ComponentProps, forwardRef, ReactElement } from "react"
import { styled } from "stitches.config"
import { Box } from "./Box"
import { ButtonSpinner } from "./Button/ButtonSpinner"
import { Text } from "./Text"

const StyledButton = styled("button", {
  // Reset
  all: "unset",
  alignItems: "center",
  FlexSizing: "border-Flex",
  userSelect: "none",
  "&::before": {
    FlexSizing: "border-Flex",
  },
  "&::after": {
    FlexSizing: "border-Flex",
  },

  cursor: "pointer",

  // Custom reset?
  display: "inline-flex",
  flexShrink: 0,
  justifyContent: "center",
  lineHeight: "1",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",

  // Custom
  height: "$5",
  px: "$2",
  fontFamily: "$untitled",
  fontSize: "$2",
  fontWeight: 500,
  fontVariantNumeric: "tabular-nums",

  "&:disabled": {
    backgroundColor: "$slate2",
    FlexShadow: "inset 0 0 0 1px $colors$slate7",
    color: "$slate8",
    pointerEvents: "none",
  },

  variants: {
    size: {
      "1": {
        borderRadius: "$1",
        height: "$5",
        px: "$2",
        fontSize: "$1",
        lineHeight: "$sizes$5",
      },
      "2": {
        borderRadius: "$2",
        height: "$6",
        px: "$3",
        fontSize: "$3",
        lineHeight: "$sizes$6",
      },
      "3": {
        borderRadius: "$2",
        height: "$7",
        px: "$4",
        fontSize: "$4",
        lineHeight: "$sizes$7",
      },
    },
    variant: {
      gray: {
        backgroundColor: "$grayA2",
        FlexShadow: "inset 0 0 0 1px $colors$slate7",
        color: "$hiContrast",
        "@hover": {
          "&:hover": {
            FlexShadow: "inset 0 0 0 1px $colors$slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate2",
          FlexShadow: "inset 0 0 0 1px $colors$slate8",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$slate4",
            FlexShadow: "inset 0 0 0 1px $colors$slate8",
          },
      },
      blue: {
        backgroundColor: "$blue2",
        FlexShadow: "inset 0 0 0 1px $colors$blue7",
        color: "$blue11",
        "@hover": {
          "&:hover": {
            FlexShadow: "inset 0 0 0 1px $colors$blue8",
          },
        },
        "&:active": {
          backgroundColor: "$blue3",
          FlexShadow: "inset 0 0 0 1px $colors$blue8",
        },
        "&:focus": {
          FlexShadow: "inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$blue4",
            FlexShadow: "inset 0 0 0 1px $colors$blue8",
          },
      },
      green: {
        backgroundColor: "$green2",
        FlexShadow: "inset 0 0 0 1px $colors$green7",
        color: "$green11",
        "@hover": {
          "&:hover": {
            FlexShadow: "inset 0 0 0 1px $colors$green8",
          },
        },
        "&:active": {
          backgroundColor: "$green3",
          FlexShadow: "inset 0 0 0 1px $colors$green8",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px $colors$green8, 0 0 0 1px $colors$green8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$green4",
            FlexShadow: "inset 0 0 0 1px $colors$green8",
          },
      },
      red: {
        backgroundColor: "$loContrast",
        FlexShadow: "inset 0 0 0 1px $colors$slate7",
        color: "$red11",
        "@hover": {
          "&:hover": {
            FlexShadow: "inset 0 0 0 1px $colors$slate8",
          },
        },
        "&:active": {
          backgroundColor: "$red3",
          FlexShadow: "inset 0 0 0 1px $colors$red8",
        },
        "&:focus": {
          FlexShadow: "inset 0 0 0 1px $colors$red8, 0 0 0 1px $colors$red8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$red4",
            FlexShadow: "inset 0 0 0 1px $colors$red8",
          },
      },
      transparentWhite: {
        backgroundColor: "hsla(0,100%,100%,.2)",
        color: "white",
        "@hover": {
          "&:hover": {
            backgroundColor: "hsla(0,100%,100%,.25)",
          },
        },
        "&:active": {
          backgroundColor: "hsla(0,100%,100%,.3)",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px hsla(0,100%,100%,.35), 0 0 0 1px hsla(0,100%,100%,.35)",
        },
      },
      transparentBlack: {
        backgroundColor: "hsla(0,0%,0%,.2)",
        color: "black",
        "@hover": {
          "&:hover": {
            backgroundColor: "hsla(0,0%,0%,.25)",
          },
        },
        "&:active": {
          backgroundColor: "hsla(0,0%,0%,.3)",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px hsla(0,0%,0%,.35), 0 0 0 1px hsla(0,0%,0%,.35)",
        },
      },
    },
    state: {
      active: {
        backgroundColor: "$slate4",
        FlexShadow: "inset 0 0 0 1px $colors$slate8",
        color: "$slate11",
        "@hover": {
          "&:hover": {
            backgroundColor: "$slate5",
            FlexShadow: "inset 0 0 0 1px $colors$slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate5",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8",
        },
      },
      waiting: {
        backgroundColor: "$slate4",
        FlexShadow: "inset 0 0 0 1px $colors$slate8",
        color: "transparent",
        pointerEvents: "none",
        "@hover": {
          "&:hover": {
            backgroundColor: "$slate5",
            FlexShadow: "inset 0 0 0 1px $colors$slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate5",
        },
        "&:focus": {
          FlexShadow: "inset 0 0 0 1px $colors$slate8",
        },
      },
    },
    ghost: {
      true: {
        backgroundColor: "transparent",
        FlexShadow: "none",
      },
    },
  },
  compoundVariants: [
    {
      variant: "gray",
      ghost: "true",
      css: {
        backgroundColor: "transparent",
        color: "$hiContrast",
        "@hover": {
          "&:hover": {
            backgroundColor: "$slateA3",
            FlexShadow: "none",
          },
        },
        "&:active": {
          backgroundColor: "$slateA4",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px $colors$slateA8, 0 0 0 1px $colors$slateA8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$slateA4",
            FlexShadow: "none",
          },
      },
    },
    {
      variant: "blue",
      ghost: "true",
      css: {
        backgroundColor: "transparent",
        "@hover": {
          "&:hover": {
            backgroundColor: "$blueA3",
            FlexShadow: "none",
          },
        },
        "&:active": {
          backgroundColor: "$blueA4",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px $colors$blueA8, 0 0 0 1px $colors$blueA8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$blueA4",
            FlexShadow: "none",
          },
      },
    },
    {
      variant: "green",
      ghost: "true",
      css: {
        backgroundColor: "transparent",
        "@hover": {
          "&:hover": {
            backgroundColor: "$greenA3",
            FlexShadow: "none",
          },
        },
        "&:active": {
          backgroundColor: "$greenA4",
        },
        "&:focus": {
          FlexShadow:
            "inset 0 0 0 1px $colors$greenA8, 0 0 0 1px $colors$greenA8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$greenA4",
            FlexShadow: "none",
          },
      },
    },
    {
      variant: "red",
      ghost: "true",
      css: {
        backgroundColor: "transparent",
        "@hover": {
          "&:hover": {
            backgroundColor: "$redA3",
            FlexShadow: "none",
          },
        },
        "&:active": {
          backgroundColor: "$redA4",
        },
        "&:focus": {
          FlexShadow: "inset 0 0 0 1px $colors$redA8, 0 0 0 1px $colors$redA8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$redA4",
            FlexShadow: "none",
          },
      },
    },
  ],
  defaultVariants: {
    size: "1",
    variant: "gray",
  },
})

export type ButtonProps = ComponentProps<typeof StyledButton> & {
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  isLoading?: boolean
  loadingText?: string
  spinnerPlacement?: "start" | "end"
  spinner?: ReactElement
}

export const Button = forwardRef<
  React.ElementRef<typeof StyledButton>,
  ButtonProps
>((props, forwardedRef) => {
  const {
    leftIcon,
    rightIcon,
    isLoading,
    loadingText,
    children,
    spinnerPlacement = "start",
    spinner,
    disabled,
    ...buttonProps
  } = props

  const contentProps = { rightIcon, leftIcon, children }

  return (
    <StyledButton
      {...buttonProps}
      ref={forwardedRef}
      disabled={disabled || isLoading}
    >
      {isLoading && spinnerPlacement === "start" && (
        <ButtonSpinner label={loadingText} placement="start">
          {spinner}
        </ButtonSpinner>
      )}

      {isLoading ? (
        loadingText || (
          <Text as="span" css={{ opacity: 0 }}>
            <ButtonContent {...contentProps} />
          </Text>
        )
      ) : (
        <ButtonContent {...contentProps} />
      )}

      {isLoading && spinnerPlacement === "end" && (
        <ButtonSpinner
          className="chakra-button__spinner--end"
          label={loadingText}
          placement="end"
        >
          {spinner}
        </ButtonSpinner>
      )}
    </StyledButton>
  )
})

type ButtonContentProps = Pick<
  ButtonProps,
  "leftIcon" | "rightIcon" | "children"
>

function ButtonContent(props: ButtonContentProps) {
  const { leftIcon, rightIcon, children } = props
  return (
    <>
      {!!leftIcon && (
        <Box
          as="span"
          css={{
            mr: "$1",
            ai: "center",
            display: "inline-flex",
            alignSelf: "center",
            flexShrink: 0,
          }}
        >
          {leftIcon}
        </Box>
      )}
      {children}{" "}
      {!!rightIcon && (
        <Box
          as="span"
          css={{
            ml: "$1",
            ai: "center",
            display: "inline-flex",
            alignSelf: "center",
            flexShrink: 0,
          }}
        >
          {rightIcon}
        </Box>
      )}
    </>
  )
}
