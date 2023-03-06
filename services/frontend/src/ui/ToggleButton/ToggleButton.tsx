import { FC } from 'react'
import classNames from 'classnames/bind'
import s from './ToggleButton.module.scss'

interface ToggleProps {
  sliderHandler: () => void
  disabled?: boolean
}

export const ToggleButton: FC<ToggleProps> = ({ sliderHandler, disabled }) => {
  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    sliderHandler()
  }
  const cx = classNames.bind(s)
  return (
    <label className={s.switch} onClick={clickHandler}>
      <input onClick={sliderHandler} disabled={disabled} type='checkbox' />
      <span className={cx('slider', disabled && 'disabled')} />
    </label>
  )
}
