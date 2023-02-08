import classNames from 'classnames/bind'
import React, { FC, useId, useState } from 'react'
import Button from '../Button/Button'
import s from './Input.module.scss'

interface InputProps {
  label?: string | JSX.Element
  errorMessage?: string | JSX.Element
  props?: React.InputHTMLAttributes<HTMLInputElement>
  onSubmit?: (value: string | null) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = ({
  label,
  errorMessage,
  props,
  onSubmit,
  onChange,
}) => {
  const [value, setValue] = useState<string | null>(
    props?.value?.toString() ?? null
  )
  const [isActive, setIsActive] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const inputId = useId()
  let cx = classNames.bind(s)

  const handleFocus = () => {
    if (isError) setIsError(false)
  }

  const handleBlur = () => {
    const valueIsValid = value !== undefined && value?.toString().length !== 0
    const isRequiredAndInvalid = !isError && props?.required && !valueIsValid

    if (isRequiredAndInvalid) setIsError(true)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e)
    setValue(e.target.value)
    setIsActive(true)
    setIsChanged(true)
  }

  const handleEnterBtnClick = () => {
    if (onSubmit) {
      onSubmit(value?.toString() ?? null)
    }
    setIsActive(false)
    setIsChanged(false)
    setValue(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onSubmit && event.key === 'Enter') {
      event.preventDefault()
      handleEnterBtnClick()
    }
  }

  return (
    <div className={s.input} data-active={isActive} data-error={isError}>
      {label && (
        <label htmlFor={inputId} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.container}>
        <input
          {...props}
          id={inputId}
          value={value ?? ''}
          type='text'
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={s.field}
        />
        {onSubmit && (
          <div className={cx('submit', isChanged && 'submit-active')}>
            <Button
              theme='tertiary'
              small
              props={{ onClick: handleEnterBtnClick }}>
              Enter
            </Button>
          </div>
        )}
      </div>
      {errorMessage && isError && (
        <label htmlFor={inputId} className={s.label}>
          {errorMessage}
        </label>
      )}
    </div>
  )
}
