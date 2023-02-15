import React, { useState } from 'react'
import { ReactComponent as CheckBoxMarkIcon } from '@assets/icons/checkbox_mark.svg'
import s from './Checkbox.module.scss'

interface Props {
  disabled?: boolean
  checked?: boolean
  name?: string
  label?: React.ReactNode
  props?: React.InputHTMLAttributes<HTMLInputElement>
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox = ({
  label,
  name,
  checked,
  disabled,
  onChange,
  props,
}: Props) => {
  return (
    <label className={s.container}>
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
