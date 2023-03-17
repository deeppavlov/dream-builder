import React, { FC, useEffect, useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import SidePanel from '../../ui/SidePanel/SidePanel'
import { subscribe, unsubscribe } from '../../utils/events'
import DialogSidePanel from '../DialogSidePanel/DialogSidePanel'
import s from './BaseSidePanel.module.scss'

export const BASE_SP_EVENT = 'BaseSidePanel'

interface BaseSidePanel {
  isOpen?: boolean
  position?: Partial<{
    top: number
    left: number
    right: number
    bottom: number
  }>
  children?: React.ReactNode
  isClosable?: boolean
}

export const BaseSidePanel: FC<BaseSidePanel> = ({
  isOpen: propIsOpen,
  position,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(
    false // fix
  )
  const [content, setContent] = useState<React.ReactNode>(
    // <DialogSidePanel key={0} start  /> // fix
    children
  )

  const handleClose = () => setIsOpen(false)

  /**
   * Update BaseSidePanel content, when it's triggered
   */
  const updateState = (data: BaseSidePanel) => {
    // Close BaseSidePanel, when isOpen === false
    if (data.isOpen !== undefined && !data.isOpen) {
      handleClose()
      return
    }

    // Think about mounted content, like DialogSP, example for saving chathistory
    setContent(data.children)

    // Open BaseSidePanel, if it's not already open
    if (!isOpen) setIsOpen(true)
  }
  const [isClosable, setIsClosable] = useState(true)
  const handleTrigger = (data: { detail: BaseSidePanel }) => {
    updateState(data.detail)
    data?.detail && setIsClosable(data?.detail?.isClosable!)
  }
  useEffect(() => {
    subscribe(BASE_SP_EVENT, handleTrigger)
    return () => unsubscribe(BASE_SP_EVENT, handleTrigger)
  }, [])

  return (
    <SidePanel isOpen={isOpen} setIsOpen={setIsOpen} position={position}>
      <div className={s.baseSidePanel}>
        {!isClosable && (
          <button className={s.close} onClick={handleClose}>
            <CloseIcon />
          </button>
        )}
        {content}
      </div>
    </SidePanel>
  )
}
