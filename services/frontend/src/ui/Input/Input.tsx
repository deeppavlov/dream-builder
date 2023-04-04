import classNames from 'classnames/bind'
import React, { FC, useEffect, useId, useState } from 'react'
import { FormState } from 'react-hook-form'
import Button from '../Button/Button'
import s from './Input.module.scss'

interface InputProps {
  label?: string | JSX.Element
  error?: Partial<{ type: any; message: any }>
  formState?: FormState<any>
  props?: React.InputHTMLAttributes<HTMLInputElement>
  withEnterButton?: boolean
  big?: boolean
}

export const Input: FC<InputProps> = ({
  label,
  error,
  formState,
  props,
  withEnterButton,
  big,
}) => {
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const [isEnter, setIsEnter] = useState(false) // for display Enter button
  const inputId = props?.id ?? useId()
  let cx = classNames.bind(s)

  // Hide Enter button everytime, when form submitted successfully
  const handleFormSubmit = () => {
    const isSubmitted = formState?.isSubmitted === true
    const isSubmitSuccessful = formState?.isSubmitSuccessful === true

    setIsEnter(isSubmitted && !isSubmitSuccessful)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props?.onBlur) props.onBlur(e)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.onChange) props.onChange(e)
    setIsActive(true)
    setIsEnter(true)
  }

  useEffect(() => {
    if (withEnterButton && formState) handleFormSubmit()
  }, [withEnterButton && formState?.isSubmitSuccessful])

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
          className={cx('field', big && 'big')}
        />
        {withEnterButton && (
          <div className={cx('submit', isEnter && 'submit-active')}>
            <Button theme='tertiary' small props={{ type: 'submit' }}>
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
