import { FC } from 'react'
import classNames from 'classnames/bind'
import Button from '../Button/Button'
import { ReactComponent as KebabLogo } from '../../assets/icons/kebab.svg'
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
    <Button
      theme={theme === 'card' ? 'secondary' : 'stack'}
      small
      withIcon
      props={{
        disabled,
        onClick: handleKebabBtnClick,
        'data-tooltip-id': tooltipId,
      }}>
      <div className={cx('kebab', type, disabled && 'disabled')}>
        <KebabLogo />
      </div>
    </Button>
  )
}
