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
