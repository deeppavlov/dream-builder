import { useRef, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Accordion.module.scss'

interface AccordionProps extends React.PropsWithChildren {
  title: string
  small?: boolean
  rounded?: boolean
}

export const Accordion = ({
  children,
  title,
  small,
  rounded,
}: AccordionProps) => {
  const [close, setClose] = useState<boolean>(false)
  const contentEl = useRef<HTMLDivElement>(null)
  const handleToggle = () => {
    setClose(close => !close)
  }
  return (
    <div>
      <button
        className={`${close ? s.close : ''} ${s.arrowDropdown} ${
          small ? s.arrowDropdown_small : ''
        } ${rounded ? s.arrowDropdown_rounded : ''}`}
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
