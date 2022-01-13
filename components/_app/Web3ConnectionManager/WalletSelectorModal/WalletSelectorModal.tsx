import MetaMaskOnboarding from "@metamask/onboarding"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Image from "next/image"
// import { Error } from "components/common/Error"
import { Link } from "@components/common/Link"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@components/common/Dialog"
import { injected } from "connector"
import React, { useEffect, useRef } from "react"
import ConnectorButton from "./ConnectorButton"
import { Flex } from "@components/common/Flex"

type Props = {
  activatingConnector?: AbstractConnector
  setActivatingConnector: (connector?: AbstractConnector) => void
  isModalOpen: boolean
  closeModal: () => void
  openNetworkModal: () => void
}

const WalletSelectorModal = ({
  activatingConnector,
  setActivatingConnector,
  isModalOpen,
  closeModal,
  openNetworkModal, // Passing as prop to avoid dependency cycle
}: Props): JSX.Element => {
  const { error } = useWeb3React()
  const { active, activate, connector, setError } = useWeb3React()

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  const handleConnect = (provider: AbstractConnector) => {
    setActivatingConnector(provider)
    activate(provider, undefined, true).catch((err) => {
      setActivatingConnector(undefined)
      setError(err)
    })
  }
  const handleOnboarding = () => onboarding.current?.startOnboarding()

  useEffect(() => {
    if (active) closeModal()
  }, [active, closeModal])

  useEffect(() => {
    if (error instanceof UnsupportedChainIdError) {
      closeModal()
      openNetworkModal()
    }
  }, [error, openNetworkModal, closeModal])

  return (
    <Dialog open={isModalOpen}>
      <DialogContent>
        <DialogTitle>Connect to a wallet</DialogTitle>
        <DialogClose onClick={closeModal} />
        {/* <Error error={error} processError={processConnectionError} /> */}
        <Flex css={{ gap: "$4", fd: "column" }}>
          <ConnectorButton
            name={
              typeof window !== "undefined" &&
              MetaMaskOnboarding.isMetaMaskInstalled()
                ? "MetaMask"
                : "Install MetaMask"
            }
            onClick={
              typeof window !== "undefined" &&
              MetaMaskOnboarding.isMetaMaskInstalled()
                ? () => handleConnect(injected)
                : handleOnboarding
            }
            rightIcon={
              <Image
                src={"/image/wallet/metamask.png"}
                height={24}
                width={24}
                alt="Extension logo"
              />
            }
            disabled={connector === injected || !!activatingConnector}
            isActive={connector === injected}
            isLoading={activatingConnector === injected}
          />
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

export default WalletSelectorModal
