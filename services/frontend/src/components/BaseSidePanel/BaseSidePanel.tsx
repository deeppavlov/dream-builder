import React, { FC, useEffect, useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import SidePanel from '../../ui/SidePanel/SidePanel'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './BaseSidePanel.module.scss'

export const BASE_SP_EVENT = 'BaseSidePanel'

interface BaseSidePanel {
  isOpen?: boolean
  position?: Partial<{
    top: number | 'auto'
    left: number | 'auto'
    right: number | 'auto'
    bottom: number | 'auto'
  }>
  children?: React.ReactNode
  isClosable?: boolean
  withTransition?: boolean
}

export const BaseSidePanel: FC<BaseSidePanel> = ({
  isOpen: propIsOpen,
  position,
  children,
  withTransition: propWithTransition = true,
  isClosable: propsIsClosable = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(propIsOpen))
  const [withTransition, setWithTransition] =
    useState<boolean>(propWithTransition)
  const [isClosable, setIsClosable] = useState<boolean>(propsIsClosable)
  const [content, setContent] = useState<React.ReactNode>(children)

  const handleClose = () => {
    setIsOpen(false)
  }

  /**
   * Update BaseSidePanel content, when it's triggered
   */
  const updateState = (data: BaseSidePanel) => {
    if (data.withTransition !== undefined) {
      setWithTransition(data.withTransition)
    } else setWithTransition(true)

    if (data.isClosable !== undefined) {
      setIsClosable(data.isClosable)
    } else setIsClosable(true)

    // Close BaseSidePanel, when isOpen === false
    if (data.isOpen !== undefined && !data.isOpen) {
      handleClose()
      return
    }

    setContent(data.children)

    // Open BaseSidePanel, if it's not already open
    if (!isOpen) setIsOpen(true)
  }
  const handleTrigger = (data: { detail: BaseSidePanel }) => {
    updateState(data.detail)
  }

  useEffect(() => {
    subscribe(BASE_SP_EVENT, handleTrigger)
    return () => unsubscribe(BASE_SP_EVENT, handleTrigger)
  }, [])

  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      withTransition={withTransition}>
      <div className={s.baseSidePanel}>
        {isClosable && (
          <button className={s.close} onClick={handleClose}>
            <CloseIcon />
          </button>
        )}
        {content}
      </div>
    </SidePanel>
  )
}
