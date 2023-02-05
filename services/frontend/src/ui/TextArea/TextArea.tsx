import React, { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import Button from '../Button/Button'
import s from './TextArea.module.scss'

interface TextAreaProps {
  label?: string | JSX.Element
  about?: string | JSX.Element
  errorMessage?: string | JSX.Element | null
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  onSubmit?: (value: string | null) => void
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  about,
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
  const textAreaId = useId()
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e)
    setValue(e.target.value)
    setIsActive(true)
    setIsChanged(true)
  }

  const handleEnterBtnClick = () => {
    setIsActive(false)
    setIsChanged(false)
    setValue(null)

    if (onSubmit) {
      onSubmit(value?.toString() ?? null)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onSubmit && event.key === 'Enter') {
      event.preventDefault()
      handleEnterBtnClick()
    }
  }

  return (
    <div className={s.textArea} data-active={isActive} data-error={isError}>
      {label && (
        <label htmlFor={textAreaId} className={s.label}>
          {label}
        </label>
      )}
      <div className={cx('container', 'resizer-container')}>
        <TextAreaLogo className={s.resizer} />
        <textarea
          {...props}
          id={textAreaId}
          value={value ?? ''}
          rows={2}
          cols={20}
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

      {(about || (isError && errorMessage)) && (
        <label htmlFor={textAreaId} className={s.label}>
          {isError ? errorMessage : about}
        </label>
      )}
    </div>
  )
}
