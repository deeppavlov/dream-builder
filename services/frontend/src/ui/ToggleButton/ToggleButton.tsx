import { FC } from 'react'
import classNames from 'classnames/bind'
import s from './ToggleButton.module.scss'

interface ToggleProps {
  handleToggle: (e: React.MouseEvent) => void
  disabled?: boolean
}

export const ToggleButton: FC<ToggleProps> = ({ handleToggle, disabled }) => {
  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleToggle(e)
  }
  const cx = classNames.bind(s)
  return (
    <label className={s.switch} onClick={clickHandler}>
      <input onClick={handleToggle} disabled={disabled} type='checkbox' />
      <span className={cx('slider', disabled && 'disabled')} />
    </label>
  )
}
