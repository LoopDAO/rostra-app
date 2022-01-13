import { styled } from "stitches.config"
import { violet, blackA } from "@radix-ui/colors"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

export const Checkbox = styled(CheckboxPrimitive.Root, {
  all: "unset",
  backgroundColor: "white",
  width: 25,
  height: 25,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
})

export const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  color: violet.violet11,
})
