import React, { useState } from "react"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react'
import { useAccountFlashsigner } from "@lib/hooks/useAccount"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Sidebar from "@components/Layout/Sidebar"

export default function SettingPage() {
  const { t } = useTranslation()

  const { isLoggedIn: isLoggedInFlash, account: accountFlash } = useAccountFlashsigner()

  const addressList = [
    'ckt1qyqfwyghxgvf3522cgutpaqruyy3gqugk3zqa8yddf',
  'ckt1qpth5hjexr3wehtzqpm97dzzucgemjv7sl05wnez7y72hqvuszeyyqt90590gs808qzwq8uj2z6hhr4wrs70vrgmamexx',
  'ckt1qqypm0l63rdt2jayymfrrjnyadmqe630a8skwcdpmfqqmgdje0sjsqt90590gs808qzwq8uj2z6hhr4wrs70vrg7wyejq',
  ]

  const trElems = addressList.map((address, index) => {
    return (
      <Tr key={address}>
        <Td>{address}</Td>
        <Td>Delete</Td>
      </Tr>
    )
  })

  return (
    <Sidebar>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>Address</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {trElems}
        </Tbody>
      </Table>
    </Sidebar>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
