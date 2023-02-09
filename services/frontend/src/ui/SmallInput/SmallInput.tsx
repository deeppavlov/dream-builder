import { useState } from 'react'
import s from './SmallInput.module.scss'

interface Props {
  disabled?: boolean
  label?: React.ReactNode
  value?: string
  type?: 'text' | 'number'
}

const SmallInput = ({ value: propValue, label, type, disabled }: Props) => {
  const [value, setValue] = useState<string>(propValue ?? '')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value)

  return (
    <label className={s.container}>
      {label}
      <input
        className={s.smallInput}
        type={type ?? 'text'}
        value={value}
        disabled={disabled}
        onChange={handleInputChange}
      />
    </label>
  )
}

export default SmallInput
