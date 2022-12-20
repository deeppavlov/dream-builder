import { useRef, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Accordion.module.scss'

interface AccordionProps extends React.PropsWithChildren {
  title: string
  small?: boolean
}

export const Accordion = ({ children, title, small }: AccordionProps) => {
  const [close, setClose] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)
  const handleToggle = () => {
    setClose(!close)
  }
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
