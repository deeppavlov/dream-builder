import classNames from 'classnames/bind'
import React, { FC, useEffect, useId, useState } from 'react'
import {
  Control,
  RegisterOptions,
  useController,
  UseFormSetError,
} from 'react-hook-form'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { LanguageModel } from '../../types/types'
import getTokensLength from '../../utils/getTokensLength'
import Button from '../Button/Button'
import s from './TextArea.module.scss'

interface TextAreaProps {
  label?: string | JSX.Element
  about?: string | JSX.Element
  countType?: 'tokenizer' | 'character'
  tokenizerModel?: LanguageModel
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  withCounter?: boolean
  withEnterButton?: boolean
  defaultValue?: string
  resizable?: boolean
  fullHeight?: boolean
  control: Control<any>
  name: string
  rules?: RegisterOptions
  setError?: UseFormSetError<any>
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  about,
  countType,
  tokenizerModel,
  props,
  withCounter,
  withEnterButton,
  defaultValue,
  resizable = true,
  fullHeight,
  control,
  name,
  rules,
  setError,
}) => {
  const isTokenizer = countType === 'tokenizer'
  const {
    field,
    formState,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: isTokenizer
      ? Object.assign({}, rules, { maxLength: undefined })
      : rules,
    defaultValue,
  })
  const maxLength = rules?.maxLength as { value: number; message: string }
  const value = isTokenizer
    ? useDebouncedValue(field.value || '', 500)
    : field.value || ''
  const [length, setLength] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const [isEnter, setIsEnter] = useState(false) // for display Enter button
  const textAreaId = props?.id ?? useId()
  const pr = new Intl.PluralRules('ar-EG')
  const suffixes = new Map([
    ['zero', 's'],
    ['one', ''],
    ['two', 's'],
    ['few', 's'],
    ['many', 's'],
    ['other', 's'],
  ])
  let cx = classNames.bind(s)

  const handleBlur = () => {
    field.onBlur()
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e)
    setIsActive(true)
    setIsEnter(true)

    if (isTokenizer) setIsTyping(true)
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

  // Calculate tokens length
  useEffect(() => {
    if (countType !== 'tokenizer') return setLength(value.length)
    const length = getTokensLength(tokenizerModel, value)
    const isMaxLength = maxLength && setError && length > maxLength?.value

    setLength(length)
    setIsTyping(false)
    if (isMaxLength) setError(name, maxLength)
  }, [value])

  return (
    <div
      className={cx('textArea', fullHeight && 'fullHeight')}
      data-active={isActive}
      data-error={error !== undefined}
    >
      {(label || withCounter) && (
        <label htmlFor={textAreaId} className={s.label}>
          {label && <span className={s.title}>{label}</span>}
          {withCounter && maxLength?.value && (
            <span className={s.counter}>
              {length}
              {isTokenizer && isTyping && '+ counting...'}/{maxLength?.value}
              {isTokenizer && ` token${suffixes.get(pr.select(length))}`}
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
          {...field}
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
          {error ? <>{error.message}</> : about}
        </label>
      )}
    </div>
  )
}
