import { useState } from 'react'
import s from './Switcher.module.scss'

interface Props {
  checked?: boolean // False - 0; True - 1
  disabled?: boolean
  label?: React.ReactNode
  switcherLabels?: string[]
  props?: React.InputHTMLAttributes<HTMLInputElement>
}

const Switcher = ({
  label,
  switcherLabels,
  checked: propChecked,
  disabled,
  props,
}: Props) => {
  return (
    <label className={s.container}>
      {label}
      <div className={s.switcher}>
        <input
          {...props}
          type='checkbox'
          // checked={props?.checked}
          disabled={disabled}
          // onChange={handleCheckboxChange}
        />
        <span className={s.switch}>{switcherLabels?.[0] || 0}</span>
        <span className={s.switch}>{switcherLabels?.[1] || 1}</span>
      </div>
    </label>
  )
}

export default Switcher
