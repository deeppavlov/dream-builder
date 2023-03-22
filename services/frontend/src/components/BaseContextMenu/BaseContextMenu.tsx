import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useCheckClickOutside } from '../../hooks/useCheckClickOutside'
import { useCheckDocumentScroll } from '../../hooks/useCheckDocumentScroll'
import s from './BaseContextMenu.module.scss'

interface Props {
  tooltipId: string
  lastEdited?: {
    author: string
    date: string
  }
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  place?: 'top' | 'right' | 'bottom' | 'left'
}

const BaseContextMenu: React.FC<Props> = ({
  tooltipId,
  children,
  place = 'right',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [domReady, setDomReady] = React.useState(false)
  const container = document.body

  useEffect(() => {
    setDomReady(true)
  }, [])

  useCheckClickOutside(isOpen, ref, setIsOpen)
  useCheckDocumentScroll(isOpen, setIsOpen)

  return domReady
    ? createPortal(
        <ReactTooltip
          className={s.contextMenu}
          id={tooltipId}
          events={['click']}
          clickable
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          place={place}>
          <div ref={ref}>{children}</div>
        </ReactTooltip>,
        container
      )
    : null
}

export default BaseContextMenu
