import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
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
  return (
    <ReactTooltip
      className={s.contextMenu}
      id={tooltipId}
      events={['click']}
      clickable
      place={place}>
      {children}
    </ReactTooltip>
  )
}

export default BaseContextMenu
