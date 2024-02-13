import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useCheckDocumentScroll } from 'hooks/useCheckDocumentScroll'
import { subscribe, unsubscribe } from 'utils/events'
import s from './BaseContextMenu.module.scss'

type TPlace = 'top' | 'right' | 'bottom' | 'left'

interface Props {
  tooltipId: string
  lastEdited?: {
    author: string
    date: string
  }
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  place?: TPlace
  offset?: Partial<{
    x: number
    y: number
  }>
}

const BaseContextMenu: React.FC<Props> = ({
  tooltipId,
  children,
  place = 'right',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [domReady, setDomReady] = React.useState(false)

  const hideMenu = () => setIsOpen(false)

  useEffect(() => {
    if (isOpen) {
      subscribe('CtxMenuBtnClick', hideMenu)
    }
    return () => {
      unsubscribe('CtxMenuBtnClick', hideMenu)
    }
  }, [isOpen])

  useEffect(() => setDomReady(true), [])
  useCheckDocumentScroll(isOpen, setIsOpen)

  const setOpen = (newValue: boolean) => {
    setIsOpen(prev => (prev ? false : newValue))
  }

  return domReady
    ? createPortal(
        <ReactTooltip
          className={s.contextMenu}
          id={tooltipId}
          openOnClick
          clickable
          isOpen={isOpen}
          setIsOpen={setOpen}
          place={place}
        >
          <div>{children}</div>
        </ReactTooltip>,
        document.body
      )
    : null
}

export default BaseContextMenu
