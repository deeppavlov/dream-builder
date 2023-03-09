import { FC } from 'react'
import classNames from 'classnames/bind'
import Button from '../Button/Button'
import s from './Kebab.module.scss'

interface KebabProps {
  tooltipId: string
  type?: 'row' | 'column'
  theme?: 'stack' | 'card' // Stack theme for Editor stack elements
  disabled?: boolean
}

export const Kebab: FC<KebabProps> = ({
  tooltipId,
  disabled,
  type,
  theme = 'stack',
}) => {
  const cx = classNames.bind(s)

  const handleKebabBtnClick = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div data-tip data-tooltip-id={tooltipId}>
      <Button
        theme={theme === 'card' ? 'secondary' : undefined}
        small
        withIcon
        props={{ disabled, onClick: handleKebabBtnClick }}>
        <div className={cx('kebab', type, disabled && 'disabled')}>
          <figure className={s.dots} />
          <figure className={s.dots} />
          <figure className={s.dots} />
        </div>
      </Button>
    </div>
  )
}
