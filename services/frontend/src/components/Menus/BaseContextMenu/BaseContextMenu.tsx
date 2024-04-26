import classNames from 'classnames/bind'
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
  className?: string
  noArrow?: boolean
}

const BaseContextMenu: React.FC<Props> = ({
  tooltipId,
  children,
  place = 'right',
  offset = { x: 0, y: 0 },
  className,
  noArrow = false,
}) => {
  const cx = classNames.bind(s)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [domReady, setDomReady] = React.useState(false)

  const hideMenu = () => setIsOpen(false)

  const [parent, setParent] = useState<HTMLElement | null>(null)

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
  useCheckClickOutside(isOpen, ref, hideMenu, parent)

  return domReady
    ? createPortal(
        <ReactTooltip
          className={cx(
            className ? className : s.contextMenu,
            isOpen && 'open'
          )}
          id={tooltipId}
          openOnClick
          clickable
          isOpen={isOpen}
          setIsOpen={(newValue: boolean) => {
            setIsOpen(prev => (prev ? false : newValue))
          }}
          place={place}
          noArrow={noArrow}
        >
          <div ref={ref}>{children}</div>
        </ReactTooltip>,
        document.body
      )
    : null
}

export default BaseContextMenu
