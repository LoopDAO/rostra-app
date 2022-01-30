import React, { useEffect } from 'react'
import { getResultFromURL } from '@nervina-labs/flashsigner'

import { useAccountFlashsigner } from '@lib/hooks/useAccount'
import router from 'next/router'

export interface RouteState {
  uuid: string
  toAddress: string
}

export const Flashsigner: React.FC = () => {
  const { setAccount } = useAccountFlashsigner()

  useEffect(() => {
    getResultFromURL<RouteState>({
      onLogin(res) {
        const { address, pubkey, message, signature } = res
        setAccount({
          address,
          auth: {
            pubkey,
            signature,
            message,
          }
        })
        router.push({
          pathname: '/', 
        })
      },
      // onSignTransaction(res) {
      //   console.log('onSignTransaction', res)
      //   router.push({
      //     pathname: '/',
      //   })
      // navigate(RoutePath.SignTransaction, {
      //   replace: true,
      //   state: {
      //     tx: res.transaction,
      //   }
      // })
      // },
      onSignMessage(res) {
        console.log('onSignMessage', res)
        router.push({
          pathname: '/',
        })
      },
      onSignRawMessage(res) {
        console.log('onSignRawMessage', res)
        router.push({
          pathname: `/guild/create/sign-raw-message=${res.signature}`,
        })
      },
      // onTransferMnft(res) {
      //   const { uuid, toAddress } = res.extra!
      //   navigate(`${RoutePath.Transfer}/${uuid}`, {
      //     state: {
      //       tx: res.transaction,
      //       toAddress,
      //     },
      //     replace: true,
      //   })
      // },
      onError(err) {
        alert(err)
        router.push({
          pathname: '/',
        })
      }
    })
  }, [])

  return null
}
export default Flashsigner
