import { useRef, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Accordeon.module.scss'

export const Accordeon = ({ children, title }: any) => {
  const [close, setClose] = useState(false)
  const contentEl = useRef()
  const handleToggle = () => {
    setClose(!close)
  }
  console.log(contentEl?.current)
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
