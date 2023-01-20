import React, { FC, useState } from 'react'
import { nanoid } from 'nanoid'
import Button from '../Button/Button'
import s from './Input.module.scss'

interface InputProps {
  label?: string | JSX.Element
  errorMessage?: string
  props?: React.InputHTMLAttributes<HTMLInputElement>
  onSubmit?: (value: string) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = ({
  label,
  errorMessage,
  props,
  onSubmit,
  onChange,
}) => {
  const [value, setValue] = useState(props?.value ?? '')
  const [isActive, setIsActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState(errorMessage)
  const inputId = nanoid(8)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e)

    const targetValue = e.target.value
    const valueIsEmpty = targetValue.length === 0

    setValue(targetValue)

    if (valueIsEmpty) {
      setIsActive(false)
      return
    }

    setIsActive(true)
  }

  const handleEnterBtnClick = () => {
    setIsActive(false)
    if (onSubmit && value !== undefined && value !== '') {
      onSubmit(value.toString())
    }
  }

  return (
    <div className={s.input}>
      {label && (
        <label htmlFor={inputId} className={s.input__label}>
          {label}
        </label>
      )}
      <div className={s.input__container}>
        <input
          {...props}
          id={inputId}
          value={value}
          type='text'
          onChange={handleInputChange}
          className={`${s.input__field} ${
            isActive ? s.input__field_active : ''
          } ${errorMsg ? s.input__field_error : ''}`}
        />
        {onSubmit && (
          <div className={s.input__submit}>
            <Button
              theme='tertiary'
              small
              props={{ onClick: handleEnterBtnClick }}>
              Enter
            </Button>
          </div>
        )}
      </div>

      {errorMsg && (
        <label
          htmlFor={inputId}
          className={`${s.input__label} ${s['input__error-msg']}`}>
          {errorMsg}
        </label>
      )}
    </div>
  )
}
