import classNames from 'classnames/bind'
import { FC } from 'react'
import { ReactComponent as KebabLogo } from 'assets/icons/kebab.svg'
import { stopPropagation } from 'utils/stopPropagation'
import { Button } from 'components/Buttons'
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

  return (
    <Button
      theme={theme === 'card' ? 'secondary' : 'stack'}
      small
      withIcon
      props={{
        disabled,
        'data-tooltip-id': tooltipId,
      }}
    >
      <div className={cx('kebab', type, disabled && 'disabled')}>
        <KebabLogo />
      </div>
    </Button>
  )
}
