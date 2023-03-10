import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import { StackType } from '../../types/types'
import s from './Accordion.module.scss'

interface AccordionProps extends React.PropsWithChildren {
  title: string
  small?: boolean
  rounded?: boolean
  group: StackType
  closed?: boolean
}

export const Accordion = ({
  children,
  title,
  small,
  rounded,
  group,
  closed,
}: AccordionProps) => {
  const [close, setClose] = useState<boolean>(false)
  const contentEl = useRef<HTMLDivElement>(null)
  let cx = classNames.bind(s)

  useEffect(() => {
    closed && setClose(true)
  }, [])

  const handleToggle = () => setClose(close => !close)

  return (
    <>
      <button
        className={cx(
          'accordion',
          group,
          close && 'closed',
          small && 'small',
          rounded && 'rounded'
        )}
        onClick={handleToggle}>
        {title}
        <Arrow />
      </button>
      <div
        ref={contentEl}
        className={cx('elements', close && 'closed')}
        style={{ height: close ? '0px' : contentEl.current?.scrollHeight }}>
        {children}
      </div>
    </>
  )
}
