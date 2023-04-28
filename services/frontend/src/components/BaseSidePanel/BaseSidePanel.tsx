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
  const { dispatch } = useDisplay()
  const observedEventName =
    transition === 'left' ? TRIGGER_LEFT_SP_EVENT : TRIGGER_RIGHT_SP_EVENT

  const handleClose = () => setIsOpen(false)

  /**
   * Update BaseSidePanel content, when it's triggered
   */
  const updateState = (data: { detail: BaseSidePanel }) => {
    const { isClosable, isOpen: detailsIsOpen, children } = data.detail

    if (isClosable !== undefined) {
      setIsClosable(isClosable)
    } else setIsClosable(true)

    if (detailsIsOpen !== undefined && !detailsIsOpen) return handleClose()

    setContent(children)

    if (!isOpen) setIsOpen(true)
  }

  useObserver(observedEventName, updateState)

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
