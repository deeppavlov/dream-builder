import classNames from 'classnames/bind'
import React, { FC, useEffect, useId, useState } from 'react'
import {
  Control,
  RegisterOptions,
  UseFormSetError,
  useController,
} from 'react-hook-form'
import { checkIfEmptyString } from 'utils/formValidate'
import { Button } from 'components/Buttons'
import s from './Input.module.scss'

interface InputProps {
  control: Control<any>
  name: string
  label?: string | JSX.Element
  defaultValue?: string
  rules?: RegisterOptions
  props?: React.InputHTMLAttributes<HTMLInputElement>
  withEnterButton?: boolean
  big?: boolean
  setError?: UseFormSetError<any>
}

export const Input: FC<InputProps> = ({
  label,
  control,
  name,
  rules,
  defaultValue,
  setError,
  props,
  withEnterButton,
  big,
}) => {
  const {
    field,
    formState,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: Object.assign(
      {},
      rules,
      rules?.required ? { validate: checkIfEmptyString } : {}
    ),
    defaultValue,
  })
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

  const handleBlur = () => {
    field.onBlur()
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
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
      data-error={error !== undefined}
    >
      {label && (
        <label htmlFor={inputId} className={cx('label', 'title')}>
          {label}
        </label>
      )}
      <div className={s.container}>
        <input
          {...props}
          {...field}
          id={inputId}
          value={field.value || ''}
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
