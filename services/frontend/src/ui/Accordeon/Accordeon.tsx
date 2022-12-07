import { useRef, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Accordeon.module.scss'

interface AccordeonProps extends React.PropsWithChildren {
  title: string
  small?: boolean
}

export const Accordeon = ({ children, title, small }: AccordeonProps) => {
  const [close, setClose] = useState(false)
  const contentEl = useRef()
  const handleToggle = () => {
    setClose(!close)
  }
  // console.log(contentEl?.current)
  return (
    <div>
      <button
        className={`${close ? s.close : ''} ${s.arrowDropdown} ${
          small ? s.arrowDropdown_small : ''
        }`}
        onClick={handleToggle}>
        {title}
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
    </div>
  )
}
