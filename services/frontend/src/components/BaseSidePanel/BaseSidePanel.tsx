import React, { FC, useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import SidePanel from '../../ui/SidePanel/SidePanel'
import { useObserver } from '../../hooks/useObserver'
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
  parent?: React.MutableRefObject<any>
  isClosable?: boolean
  transition?: 'left' | 'right' | 'none'
}

export const BaseSidePanel: FC<BaseSidePanel> = ({
  isOpen: propIsOpen,
  position,
  children,
  transition,
  isClosable: propsIsClosable = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(propIsOpen))
  const [isClosable, setIsClosable] = useState<boolean>(propsIsClosable)
  const [content, setContent] = useState<React.ReactNode>(children)
  const [parent, setParent] = useState<HTMLElement>()

  const setParentFocus = (isFocused: boolean, el?: HTMLElement) => {
    if (!isFocused) {
      parent?.removeAttribute('data-active')
      return
    }

    setParent(prev => {
      prev?.removeAttribute('data-active')
      el?.setAttribute('data-active', 'true')
      return el
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    setParentFocus(false)
  }

  /**
   * Update BaseSidePanel content, when it's triggered
   */
  const updateState = (data: BaseSidePanel) => {
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
    setParentFocus(true, data.detail.parent?.current)
  }

  useObserver(BASE_SP_EVENT, handleTrigger)

  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
      position={position}
      transition={transition}>
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
