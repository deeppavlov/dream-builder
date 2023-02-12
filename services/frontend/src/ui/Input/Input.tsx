import classNames from 'classnames/bind'
import React, { FC, useId, useState } from 'react'
import Button from '../Button/Button'
import s from './Input.module.scss'

interface InputProps {
  label?: string | JSX.Element
  error?: Partial<{ type: any; message: any }>
  props?: React.InputHTMLAttributes<HTMLInputElement>
  onEnterPress?: (value: string | null) => void
}

export const Input: FC<InputProps> = ({
  label,
  error,
  props,
  onEnterPress,
}) => {
  const [value, setValue] = useState<string | null>(
    props?.value?.toString() ?? null
  )
  const [isActive, setIsActive] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const inputId = props?.id ?? useId()
  let cx = classNames.bind(s)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props?.onBlur) props.onBlur(e)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.onChange) props.onChange(e)
    setValue(e.target.value)
    setIsActive(true)
    setIsChanged(true)
  }

  const handleEnterBtnClick = () => {
    onEnterPress && onEnterPress(value)
    setIsActive(false)
    setIsChanged(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onEnterPress && event.key === 'Enter') {
      event.preventDefault()
      handleEnterBtnClick()
    }
  }

  return (
    <div
      className={s.input}
      data-active={isActive}
      data-error={error !== undefined}>
      {label && (
        <label htmlFor={inputId} className={cx('label', 'title')}>
          {label}
        </label>
      )}
      <div className={s.container}>
        <input
          {...props}
          id={inputId}
          value={value ?? ''}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={s.field}
        />
        {onEnterPress && !error && (
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
      {error && (
        <label htmlFor={inputId} className={s.label}>
          {error.message}
        </label>
      )}
    </div>
  )
}
