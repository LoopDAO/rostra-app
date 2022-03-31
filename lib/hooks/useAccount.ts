import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { useMemo } from 'react'

export interface Account {
  address: string
  auth: {
    pubkey: string
    message: string
    signature: string
  }
}

export const initAccount = {
  address: '',
  auth: {
    pubkey: '',
    message: '',
    signature: '',
  }
}

export const accountAtom = atomWithStorage<Account>('account', initAccount)

export const chainTypeAtom = atomWithStorage<'mainnet' | 'testnet'>('chainType', 'mainnet')

export const useChainType = () => useAtom(chainTypeAtom)

export const useAccountFlashsigner = () => {
  const [account, setAccount] = useAtom(accountAtom)
  const logout = () => setAccount(initAccount)
  const isLoggedIn = useMemo(() => !!account.address, [account])

  return {
    account,
    setAccount,
    logout,
    isLoggedIn,
  }
}
