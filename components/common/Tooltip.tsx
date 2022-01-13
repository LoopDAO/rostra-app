import React, { PropsWithChildren, ReactElement } from "react"
import { styled, keyframes } from "stitches.config"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import type { TooltipContentProps } from "@radix-ui/react-tooltip"

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
})

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
})

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
})

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
})

const StyledContent = styled(TooltipPrimitive.Content, {
  borderRadius: 4,
  padding: "10px 15px",
  fontSize: 14,
  lineHeight: 1,
  color: "$whiteA12",
  backgroundColor: "$blackA12",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform, opacity",
    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
})

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: "$loContrast",
})

export type TooltipProps = Pick<TooltipContentProps, "side" | "sideOffset"> & {
  trigger?: ReactElement
  label?: string
  isDisabled?: boolean
}

export const Tooltip = ({
  isDisabled,
  trigger,
  label,
  side,
  sideOffset,
  children,
}: PropsWithChildren<TooltipProps>) => {
  return (
    <TooltipPrimitive.Root delayDuration={66}>
      <TooltipPrimitive.Trigger asChild>
        {trigger ?? children}
      </TooltipPrimitive.Trigger>
      {!!label && !isDisabled && (
        <StyledContent sideOffset={sideOffset} side={side} >
          <StyledArrow />
          {label}
        </StyledContent>
      )}
    </TooltipPrimitive.Root>
  )
}
