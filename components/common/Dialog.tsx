import React, { ComponentProps } from "react"
import { styled, keyframes } from "stitches.config"
import { violet, blackA, } from "@radix-ui/colors"
import { Cross2Icon } from "@radix-ui/react-icons"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { IconButton } from "./IconButton"

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
})

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: "$blackA9",
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
})

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: "$loContrast",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  "&:focus": { outline: "none" },
})

function Content({ children, ...props }: ComponentProps<typeof StyledContent>) {
  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent {...props}>{children}</StyledContent>
    </DialogPrimitive.Portal>
  )
}

const StyledTitle = styled(DialogPrimitive.Title, {
  margin: 0,
  marginBottom: "$2",
  fontWeight: 500,
  color: "$mauve12",
  fontSize: 17,
})

const StyledDescription = styled(DialogPrimitive.Description, {
  margin: "10px 0 20px",
  color: "$mauve11",
  fontSize: 15,
  lineHeight: 1.5,
})

// Exports
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogContent = Content
export const DialogTitle = StyledTitle
export const DialogDescription = StyledDescription
export const DialogClose = (props: ComponentProps<typeof DialogPrimitive.Close>) => (
  <DialogPrimitive.Close asChild {...props}>
    <IconButton
      css={{
        position: "absolute",
        top: 10,
        right: 10,
        color: "$gray10",
        "&:hover": { backgroundColor: "$violet4" },
        "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
      }}
    >
      <Cross2Icon />
    </IconButton>
  </DialogPrimitive.Close>
)
