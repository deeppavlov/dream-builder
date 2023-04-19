import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import React, { FC, useEffect, useState } from 'react'
import { useDisplay } from '../../context/DisplayContext'
import { useObserver } from '../../hooks/useObserver'
import SidePanel from '../../ui/SidePanel/SidePanel'
import { consts } from '../../utils/consts'
import s from './BaseSidePanel.module.scss'

export const TRIGGER_RIGHT_SP_EVENT = 'TRIGGER_RIGHT_SP_EVENT'
export const TRIGGER_LEFT_SP_EVENT = 'TRIGGER_LEFT_SP_EVENT'

type TTransition = 'left' | 'right'

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
  transition?: TTransition | 'none'
}

/**
 * On the one page could be have a few BaseSidePanel components,
 * but with different opening sides, such as `left` or `right`.
 * Use param `transition` to adjust openning side.
 */
export const BaseSidePanel: FC<BaseSidePanel> = ({
  isOpen: propIsOpen,
  position,
  children,
  transition = 'right',
  isClosable: propsIsClosable = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(propIsOpen))
  const [isClosable, setIsClosable] = useState<boolean>(propsIsClosable)
  const [content, setContent] = useState<React.ReactNode>(children)
  const [parent, setParent] = useState<HTMLElement>()
  const { dispatch } = useDisplay()

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

  useObserver(
    transition === 'left' ? TRIGGER_LEFT_SP_EVENT : TRIGGER_RIGHT_SP_EVENT,
    handleTrigger
  )

  useEffect(() => {
    const side = transition === 'left' ? 'LEFT' : 'RIGHT'

    dispatch({
      type: 'set',
      option: {
        id: consts[`${side}_SP_IS_ACTIVE`],
        value: isOpen,
      },
    })
  }, [isOpen])

  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
      position={position}
      transition={transition}
      key={transition}
    >
      <div className={s.baseSidePanel} id={`sp_${transition}`}>
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
