import { useRef, useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Accordion.module.scss'

interface AccordionProps extends React.PropsWithChildren {
  title: string
  small?: boolean
  rounded?: boolean
  type?: 'skills' | 'skill_selectors' | 'response_selectors' | 'annotators'
}

export const Accordion = ({
  children,
  title,
  small,
  rounded,
  type,
}: AccordionProps) => {
  const [close, setClose] = useState<boolean>(false)
  const contentEl = useRef<HTMLDivElement>(null)
  const handleToggle = () => {
    setClose(close => !close)
  }
  let cx = classNames.bind(s)
  return (
    <>
      <button
        className={cx(
          'arrowDropdown',
          type,
          close && 'close',
          small && 'small',
          rounded && 'rounded'
        )}
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
    </>
  )
}
