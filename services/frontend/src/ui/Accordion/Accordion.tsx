import { useRef, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Accordion.module.scss'

export const Accordion = ({ children, title }: any) => {
  const [close, setClose] = useState(false)
  const contentEl = useRef()
  const handleToggle = () => {
    setClose(!close)
  }

  return (
    <>
      <button
        className={`${close ? s.close : null} ${s.arrowDropdown}`}
        onClick={handleToggle}>
        <p>{title}</p>
        <Arrow />
      </button>
      <div
        ref={contentEl}
        className={s.elements}
        style={
          !close
            ? { height: contentEl?.current?.scrollHeight }
            : { height: '0px' }
        }>
        {children}
      </div>
    </>
  )
}
