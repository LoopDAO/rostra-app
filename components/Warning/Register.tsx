import React from "react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { Box, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

export default function RegisterWarning({ address, warning }: { address: string; warning: string }) {
  return (
    <Box>
      {warning}
      <Link href={"/dashboard"} passHref>
        <Box style={{ cursor: "pointer" }} mt={4}>
          Dashboard <ExternalLinkIcon />
        </Box>
      </Link>
      <Text mt={4}>Scan to deposit</Text>
      <QRCodeSVG value={address} />
    </Box>
  )
}
