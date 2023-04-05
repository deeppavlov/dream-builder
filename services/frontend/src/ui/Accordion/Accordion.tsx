import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import { StackType } from '../../types/types'
import s from './Accordion.module.scss'

interface AccordionProps extends React.PropsWithChildren {
  title: string
  small?: boolean
  rounded?: boolean
  group?: StackType
  isActive?: boolean
}

export const Accordion = ({
  children,
  title,
  small,
  rounded,
  group,
  isActive: propIsActive,
}: AccordionProps) => {
  const [isActive, setIsActive] = useState<boolean>(propIsActive ?? false)
  const contentEl = useRef<HTMLDivElement>(null)
  let cx = classNames.bind(s)

  const handleAccordionClick = () => setIsActive(prev => !prev)

  return (
    <>
      <button
        className={cx(
          'accordion',
          group,
          isActive && 'active',
          small && 'small',
          rounded && 'rounded'
        )}
        onClick={handleAccordionClick}
      >
        {title}
        <Arrow />
      </button>
      <div
        ref={contentEl}
        className={s.elements}
        style={{ height: isActive ? contentEl.current?.scrollHeight + 'px' : '0px' }}
      >
        {children}
      </div>
    </>
  )
}
