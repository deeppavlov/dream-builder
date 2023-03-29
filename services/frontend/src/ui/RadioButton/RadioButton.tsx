import { FC, ReactNode } from 'react'
import s from './RadioButton.module.scss'

interface RadioButtonProps {
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
  return (
    <label htmlFor={htmlFor} className={s.label} data-tooltip-id={tooltipId}>
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
