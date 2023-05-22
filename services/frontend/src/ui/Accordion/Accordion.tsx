import classNames from 'classnames/bind'
import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import { StackType } from '../../types/types'
import s from './Accordion.module.scss'

interface AccordionProps extends React.PropsWithChildren {
  title: string
  small?: boolean
  rounded?: boolean
  group?: StackType
  isActive?: boolean
  type?: 'description'
}

export const Accordion = ({
  children,
  title,
  small,
  rounded,
  group,
  isActive: propIsActive,
  type,
}: AccordionProps) => {
  const [isActive, setIsActive] = useState<boolean>(propIsActive ?? false)
  const contentEl = useRef<HTMLDivElement>(null)
  let cx = classNames.bind(s)

  const handleAccordionClick = () => setIsActive(prev => !prev)
  useEffect(() => {
    if (contentEl?.current) {
      // Получаем высоту дочерних элементов и обновляем высоту контейнера
      const container = contentEl.current
      const height = Array.from(container.children).reduce(
        (acc, child) => acc + child.offsetHeight,
        0
      )
      container.style.height = isActive ? `${height}px` : '0px'
    }
  }, [children, isActive])

  return (
    <div>
      <div
        className={cx(
          'accordion',
          group,
          isActive && 'active',
          small && 'small',
          rounded && 'rounded',
          type
        )}
        onClick={handleAccordionClick}
      >
        <span>{title}</span>
        <Arrow className={cx('accordion-item__icon')} />
      </div>
      <div ref={contentEl} className={cx('elements', type)}>
        {children}
      </div>
    </div>
  )
}
