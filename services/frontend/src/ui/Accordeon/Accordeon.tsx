import { useRef, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_up.svg'
import s from './Accordeon.module.scss'

export const Accordeon = ({ children, title }: any) => {
  const [open, setOpen] = useState(false)
  const contentEl = useRef()
  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <>
      <button
        className={`${open ? s.open : null} ${s.arrowDropdown}`}
        onClick={handleToggle}>
        <p>{title}</p>
        <Arrow />
      </button>
      <div
        ref={contentEl}
        className={s.elements}
        style={
          open
            ? { height: contentEl?.current?.scrollHeight }
            : { height: '0px' }
        }>
        {children}
      </div>
    </>
  )
}
