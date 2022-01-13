import React from "react"
import { useCallbackRef } from "./useCallbackRef"

export interface UseDisclosureProps {
  isOpen?: boolean
  defaultIsOpen?: boolean
  onClose?(): void
  onOpen?(): void
}

function useControllableProp<T>(prop: T | undefined, state: T) {
  const isControlled = prop !== undefined
  const value = isControlled && typeof prop !== "undefined" ? prop : state
  return [isControlled, value] as const
}

export function useDisclosure(props: UseDisclosureProps = {}) {
  const { onClose: onCloseProp, onOpen: onOpenProp, isOpen: isOpenProp } = props

  const onOpenPropCallbackRef = useCallbackRef(onOpenProp)
  const onClosePropCallbackRef = useCallbackRef(onCloseProp)
  const [isOpenState, setIsOpen] = React.useState(props.defaultIsOpen || false)
  const [isControlled, isOpen] = useControllableProp(isOpenProp, isOpenState)

  const onClose = React.useCallback(() => {
    if (!isControlled) {
      setIsOpen(false)
    }
    onClosePropCallbackRef?.()
  }, [isControlled, onClosePropCallbackRef])

  const onOpen = React.useCallback(() => {
    if (!isControlled) {
      setIsOpen(true)
    }
    onOpenPropCallbackRef?.()
  }, [isControlled, onOpenPropCallbackRef])

  const onToggle = React.useCallback(() => {
    const action = isOpen ? onClose : onOpen
    action()
  }, [isOpen, onOpen, onClose])

  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onToggle,
  }
}
