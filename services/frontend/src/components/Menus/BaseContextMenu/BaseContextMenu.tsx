import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useCheckClickOutside } from 'hooks/useCheckClickOutside'
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
  offset = { x: 0, y: 0 },
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [domReady, setDomReady] = React.useState(false)
  const [parent, setParent] = useState<HTMLElement | null>(null)

  const hideMenu = () => setIsOpen(false)

  useEffect(() => {
    const newParent = document.body.querySelector(
      `[data-tooltip-id="${tooltipId}"]`
    ) as HTMLElement

    setParent(prev => {
      if (!isOpen) prev?.blur()
      return newParent ?? null
    })

    subscribe('CtxMenuBtnClick', hideMenu)
    return () => unsubscribe('CtxMenuBtnClick', hideMenu)
  }, [isOpen])

  useEffect(() => setDomReady(true), [])
  useCheckDocumentScroll(isOpen, setIsOpen)
  useCheckClickOutside(isOpen, ref, hideMenu)

  return domReady
    ? createPortal(
        <ReactTooltip
          className={s.contextMenu}
          id={tooltipId}
          openOnClick
          clickable
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          place={place}
        >
          <div ref={ref}>{children}</div>
        </ReactTooltip>,
        document.body
      )
    : null
}

export default BaseContextMenu
