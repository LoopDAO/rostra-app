import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"

import NetworkModal from "@components/Layout/Account/NetworkModal"
import { useDisclosure } from "@lib/hooks/useDisclosure"
import WalletSelectorModal from "./WalletSelectorModal"
import useEagerConnect from "./useEagerConnect"
import useInactiveListener from "./useInactiveListener"

const Web3Connection = createContext({
  isWalletSelectorModalOpen: false,
  openWalletSelectorModal: () => {},
  closeWalletSelectorModal: () => {},
  triedEager: false,
  isNetworkModalOpen: false,
  openNetworkModal: () => {},
  closeNetworkModal: () => {},
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const { connector, active } = useWeb3React()
  const {
    isOpen: isWalletSelectorModalOpen,
    onOpen: openWalletSelectorModal,
    onClose: closeWalletSelectorModal,
  } = useDisclosure()
  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()
  const router = useRouter()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] =
    useState<AbstractConnector>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  useEffect(() => {
    if (triedEager && !active && router.query.discordId)
      openWalletSelectorModal()
  }, [triedEager, active, router.query.discordId, openWalletSelectorModal])

  return (
    <Web3Connection.Provider
      value={{
        isWalletSelectorModalOpen,
        openWalletSelectorModal,
        closeWalletSelectorModal,
        triedEager,
        isNetworkModalOpen,
        openNetworkModal,
        closeNetworkModal,
      }}
    >
      {children}
      <WalletSelectorModal
        {...{
          activatingConnector,
          setActivatingConnector,
          isModalOpen: isWalletSelectorModalOpen,
          openModal: openWalletSelectorModal,
          closeModal: closeWalletSelectorModal,
          openNetworkModal,
        }}
      />
      {/* <NetworkModal
        {...{ isOpen: isNetworkModalOpen, onClose: closeNetworkModal }}
      /> */}
    </Web3Connection.Provider>
  )
}
export { Web3Connection, Web3ConnectionManager }
