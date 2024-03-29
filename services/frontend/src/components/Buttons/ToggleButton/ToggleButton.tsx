import classNames from 'classnames/bind'
import { FC } from 'react'
import { stopPropagation } from 'utils/stopPropagation'
import s from './ToggleButton.module.scss'

interface ToggleProps {
  handleToggle: (e: React.MouseEvent) => void
  disabled?: boolean
}

export const ToggleButton: FC<ToggleProps> = ({ handleToggle, disabled }) => {
  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    !disabled && handleToggle(e)
  }
  const cx = classNames.bind(s)
  return (
    <label className={s.switch} onClick={stopPropagation}>
      <input onClick={clickHandler} disabled={disabled} type='checkbox' />
      <span className={cx('slider', disabled && 'disabled')} />
    </label>
  )
}
