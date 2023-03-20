import React from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as CheckBoxMarkIcon } from '@assets/icons/checkbox_mark.svg'
import s from './Checkbox.module.scss'

interface Props {
  theme?: 'primary' | 'secondary'
  disabled?: boolean
  checked?: boolean
  name?: string
  label?: React.ReactNode
  props?: React.InputHTMLAttributes<HTMLInputElement>
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  defaultChecked?: boolean
}

export const Checkbox = ({
  theme = 'primary',
  label,
  name,
  checked,
  disabled,
  onChange,
  props,
}: Props) => {
  let cx = classNames.bind(s)

  return (
    <label className={cx('container', theme)}>
      <div className={s.checkbox}>
        <input
          type='checkbox'
          name={name}
          checked={checked}
          disabled={disabled}
          {...props}
        />
        <CheckBoxMarkIcon className={s.checkmark} />
      </div>
      {label}
    </label>
  )
}
