import React, { useRef } from 'react'
import s from './DialogButton.module.scss'

interface Props {
  children: React.ReactElement<SVGSVGElement>
  active?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const DialogButton = ({ children, active, onClick }: Props) => {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={ref}
      className={`${s.dialogButton} ${active && s['dialogButton_active']}`}
      onClick={onClick}
      type='button'>
      {children}
    </button>
  )
}

export default DialogButton
