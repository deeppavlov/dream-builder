import React, { useRef, useState } from 'react'
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

  useCheckClickOutside(isOpen, ref, setIsOpen)
  useCheckDocumentScroll(isOpen, setIsOpen)

  return (
    <ReactTooltip
      className={s.contextMenu}
      id={tooltipId}
      events={['click']}
      clickable
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      place={place}>
      <div ref={ref}>{children}</div>
    </ReactTooltip>
  )
}

export default BaseContextMenu
