import classNames from 'classnames/bind'
import React, { FC, useEffect, useId, useState } from 'react'
import { Control, RegisterOptions, useController } from 'react-hook-form'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
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
}) => {
  const maxLenght = rules?.maxLength as { value: number; message: string }
  const getLength = (value: string) =>
    countType === 'tokenizer'
      ? getTokensLength(tokenizerModel, value)
      : value?.length ?? 0
  const getRules = () => {
    if (countType === 'tokenizer' && maxLenght) {
      return Object.assign({}, rules, {
        maxLength: undefined,
        validate: (v: string) =>
          getLength(v) > maxLenght.value ? maxLenght.message : undefined,
      })
    }
    return rules
  }
  const { field, formState } = useController({
    name,
    control,
    rules: getRules(),
    defaultValue,
  })
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
  const error = formState.errors[name]
  let cx = classNames.bind(s)

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (control) field.onBlur()
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (control) field.onChange(e)
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
              {getLength(field.value)}/{maxLenght.value}
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
