import classNames from 'classnames/bind'
import React, { FC, useId, useState } from 'react'
import Button from '../Button/Button'
import s from './Input.module.scss'

interface InputProps {
  label?: string | JSX.Element
  error?: Partial<{ type: any; message: any }>
  props?: React.InputHTMLAttributes<HTMLInputElement>
  withEnterButton?: boolean
}

export const Input: FC<InputProps> = ({
  label,
  error,
  props,
  withEnterButton,
}) => {
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const [isChanged, setIsChanged] = useState(false) // for display Enter button
  const inputId = props?.id ?? useId()
  let cx = classNames.bind(s)

  /** On Enter press set focused state for input */
  const handleEnterBtnClick = () => {
    setIsActive(false)
    setIsChanged(false)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props?.onBlur) props.onBlur(e)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.onChange) props.onChange(e)

    if (!e.target.value) {
      handleEnterBtnClick()
      return
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleEnterBtnClick()
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
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={s.field}
        />
        {withEnterButton && !error && (
          <div className={cx('submit', isChanged && 'submit-active')}>
            <Button
              theme='tertiary'
              small
              props={{ type: 'submit', onClick: handleEnterBtnClick }}>
              Enter
            </Button>
          </div>
        )}
      </div>
      {error && (
        <label htmlFor={inputId} className={cx('label', 'about')}>
          {error?.message}
        </label>
      )}
    </div>
  )
}
