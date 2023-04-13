import { encode } from '@nem035/gpt-3-encoder'
import classNames from 'classnames/bind'
import React, { FC, useEffect, useId, useState } from 'react'
import { FormState } from 'react-hook-form'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import Button from '../Button/Button'
import s from './TextArea.module.scss'

interface TextAreaProps {
  label?: string | JSX.Element
  about?: string | JSX.Element
  countType?: 'tokenizer' | 'character'
  error?: Partial<{ type: any; message: any }>
  formState?: FormState<any>
  maxLenght?: number | string
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  withCounter?: boolean
  withEnterButton?: boolean
  resizable?: boolean
  fullHeight?: boolean
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  about,
  countType,
  error,
  formState,
  maxLenght,
  props,
  withCounter,
  withEnterButton,
  resizable = true,
  fullHeight,
}) => {
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const [isEnter, setIsEnter] = useState(false) // for display Enter button
  const [value, setValue] = useState(props?.defaultValue || '')
  const textAreaId = props?.id ?? useId()
  const pr = new Intl.PluralRules('ar-EG')
  const suffixes = new Map([
    ['zero', 's'],
    ['one', ''],
    ['two', 's'],
    ['few', 's'],
    ['many', 's'],
  ])
  const length =
    countType === 'tokenizer'
      ? encode(value?.toString()).length
      : value?.toString()?.length ?? 0
  let cx = classNames.bind(s)

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (props?.onBlur) props.onBlur(e)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props?.onChange) props.onChange(e)
    setValue(e.target.value)
    setIsActive(true)
    setIsEnter(true)
  }

  // Hide Enter button everytime, when form submitted successfully
  const handleFormSubmit = () => {
    const isSubmitted = formState?.isSubmitted === true
    const isSubmitSuccessful = formState?.isSubmitSuccessful === true

    setIsEnter(isSubmitted && !isSubmitSuccessful)
  }

  useEffect(() => {
    if (withEnterButton && formState) handleFormSubmit()
  }, [withEnterButton && formState?.isSubmitSuccessful])

  return (
    <div
      className={cx('textArea', fullHeight && 'fullHeight')}
      data-active={isActive}
      data-error={error !== undefined}
    >
      {(label || withCounter) && (
        <label htmlFor={textAreaId} className={s.label}>
          {label && <span className={s.title}>{label}</span>}
          {withCounter && maxLenght && (
            <span className={s.counter}>
              {length}/{maxLenght}
              {countType === 'tokenizer' &&
                ` token${suffixes.get(pr.select(length))}`}
            </span>
          )}
        </label>
      )}
      <div className={cx('container', resizable && 'resize-container')}>
        {resizable && <TextAreaLogo className={s.resizer} />}
        <textarea
          rows={2}
          cols={20}
          {...props}
          id={textAreaId}
          onBlur={handleBlur}
          onChange={handleChange}
          className={s.field}
        />

        {withEnterButton && (
          <div className={cx('submit', isEnter && 'submit-active')}>
            <Button theme='tertiary' small props={{ type: 'submit' }}>
              Enter
            </Button>
          </div>
        )}
      </div>

      {(about || error) && (
        <label htmlFor={textAreaId} className={cx('label', 'about')}>
          {error ? error.message : about}
        </label>
      )}
    </div>
  )
}
