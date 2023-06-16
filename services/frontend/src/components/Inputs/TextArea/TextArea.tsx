import AwesomeDebouncePromise from 'awesome-debounce-promise'
import classNames from 'classnames/bind'
import React, { FC, useEffect, useId, useState } from 'react'
import {
  Control,
  RegisterOptions,
  UseFormTrigger,
  useController,
} from 'react-hook-form'
import { ReactComponent as TextAreaLogo } from 'assets/icons/textarea.svg'
import { LanguageModel } from 'types/types'
import { checkIfEmptyString } from 'utils/formValidate'
import getTokensLength from 'utils/getTokensLength'
import { Button } from 'components/Buttons'
import s from './TextArea.module.scss'

interface TextAreaProps {
  label?: string | JSX.Element
  about?: string | JSX.Element
  countType?: 'tokenizer' | 'character'
  theme?: 'placeholder'
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
  triggerField?: UseFormTrigger<any>
}

interface IValidateTokens {
  value: string
  tokenizerModel?: LanguageModel
  maxLength: {
    value: number
    message: string
  }
  setLength: (length: number) => void
  setIsCounting: (isCounting: boolean) => void
}

const validateTokens = AwesomeDebouncePromise(
  async ({
    value,
    tokenizerModel,
    maxLength,
    setLength,
    setIsCounting,
  }: IValidateTokens) => {
    const length = getTokensLength(tokenizerModel, value)
    const isMaxLength = length > maxLength?.value

    setLength(length)
    setIsCounting(false)
    return isMaxLength ? maxLength.message : undefined
  },
  500
)

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
  theme,
  triggerField,
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
      ? Object.assign({}, rules, {
          maxLength: undefined,
          validate: (value: string) =>
            validateTokens({
              value,
              tokenizerModel,
              maxLength,
              setLength,
              setIsCounting,
            }),
        })
      : rules?.required
      ? Object.assign({}, rules, { validate: checkIfEmptyString })
      : rules,
    defaultValue,
  })
  const maxLength = rules?.maxLength as { value: number; message: string }
  const [length, setLength] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
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

  useEffect(() => {
    if (!isTokenizer) return setLength(field.value?.length ?? 0)
    if (isTokenizer) setIsCounting(true)

    const isEmpty = field.value?.length === 0

    if (isEmpty) {
      setLength(0)
      setIsCounting(false)
    }
  }, [field.value])

  useEffect(() => {
    const isCheckable = triggerField && tokenizerModel && maxLength?.value

    if (!isCheckable) return
    triggerField(name)
    setIsCounting(true)
  }, [triggerField, tokenizerModel, maxLength?.value])

  return (
    <div
      className={cx('textArea', fullHeight && 'fullHeight', theme)}
      data-active={isActive}
      data-error={error !== undefined}
    >
      {(label || withCounter) && (
        <label htmlFor={textAreaId} className={cx('label', 'header')}>
          {label && <span className={s.title}>{label}</span>}
          {withCounter && maxLength?.value && (
            <span className={s.counter}>
              {length}
              {isTokenizer && isCounting && '+ counting...'}/{maxLength?.value}
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
          spellCheck='false'
        >
          {field.value}
        </textarea>

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
