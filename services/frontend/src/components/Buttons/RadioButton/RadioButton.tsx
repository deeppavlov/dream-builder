import classNames from 'classnames/bind'
import { FC } from 'react'
import s from './RadioButton.module.scss'

export interface RadioButtonProps {
  children: React.ReactNode
  name: string
  id: string | undefined // ???
  htmlFor: string
  value: string
  disabled?: boolean
  defaultChecked?: boolean
  tooltipId?: string
  props?: React.InputHTMLAttributes<HTMLInputElement>
}
export const RadioButton: FC<RadioButtonProps> = ({
  children,
  name,
  id,
  htmlFor,
  value,
  tooltipId,
  disabled,
  defaultChecked,
  props,
}) => {
  const cx = classNames.bind(s)
  return (
    <label
      htmlFor={htmlFor}
      className={cx('label', disabled && 'disabled')}
      data-tooltip-id={tooltipId}
    >
      <input
        id={id}
        name={name}
        type='radio'
        disabled={disabled}
        defaultChecked={defaultChecked}
        value={value}
        className={s.radio}
        {...props}
      />
      {children}
    </label>
  )
}
