import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { useUIOptions } from 'context'
import React, { FC, useEffect, useState } from 'react'
import { BotInfoInterface } from 'types/types'
import { useObserver } from 'hooks/useObserver'
import { consts } from 'utils/consts'
import SidePanel from 'components/Panels/SidePanel/SidePanel'
import { AssistantDialogSidePanel } from '../AssistantDialogSidePanel/AssistantDialogSidePanel'
import s from './BaseSidePanel.module.scss'
import './BaseSidePanel.module.scss'

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
  childData: {
    key: string
    dist: BotInfoInterface
    componentName: string
  }
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
  const { setUIOption } = useUIOptions()
  const observedEventName =
    transition === 'left' ? TRIGGER_LEFT_SP_EVENT : TRIGGER_RIGHT_SP_EVENT

  const handleClose = () => setIsOpen(false)

  /**
   * Update BaseSidePanel content, when it's triggered
   */
  const updateState = (data: { detail: BaseSidePanel }) => {
    const { isClosable, children } = data.detail
    const requestToClose = data.detail?.isOpen === false

    if (isClosable !== undefined) {
      setIsClosable(isClosable)
    } else setIsClosable(true)

    if (requestToClose) return handleClose()

    const { childData } = data.detail
    if (childData?.componentName === 'AssistantDialogSidePanel') {
      setContent(
        <AssistantDialogSidePanel
          key={childData.dist.name + 'chat_with_assistant'}
          dist={childData.dist}
        />
      )
    } else {
      setContent(children)
    }
    setIsOpen(true)
  }

  useObserver(observedEventName, updateState)

  useEffect(() => {
    const side = transition === 'left' ? 'LEFT' : 'RIGHT'

    setUIOption({
      name: consts[`${side}_SP_IS_ACTIVE`],
      value: isOpen,
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
          <button
            id='base_sp_close_btn'
            className={s.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        )}
        {content}
      </div>
    </SidePanel>
  )
}
