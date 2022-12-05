import React, { InputHTMLAttributes, useState } from 'react'
import s from './Input.module.scss'

export const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const [value, setValue] = useState('')
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setValue('')
  }
  return (
    <input
      onSubmit={handleSubmit}
      className={s.input}
      type='text'
      onChange={event => setValue(event.target.value)}
      value={value}
      {...props}
    />
  )
}
