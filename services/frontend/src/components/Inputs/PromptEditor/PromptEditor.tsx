import AwesomeDebouncePromise from 'awesome-debounce-promise'
import classNames from 'classnames/bind'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import {
  Control,
  RegisterOptions,
  UseFormTrigger,
  useController,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ReactComponent as TextAreaLogo } from 'assets/icons/textarea.svg'
import { IEditorContext, LanguageModel } from 'types/types'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import getTokensLength from 'utils/getTokensLength'
import { TextEditor } from '../TextEditor/TextEditor'
import s from './PromptEditor.module.scss'

interface IProps {
  name: string
  control: Control<any>
  label?: string | JSX.Element
  placeholder?: string
  about?: string | JSX.Element
  tokenizerModel?: LanguageModel
  defaultValue?: string
  resizable?: boolean
  rules?: RegisterOptions
  triggerField?: UseFormTrigger<any>
  editorContext: IEditorContext
  setEditorContext: Dispatch<SetStateAction<IEditorContext>>
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
    const isValue = value.length > 0

    if (!isValue) {
      setLength(0)
      setIsCounting(false)
      return undefined
    }

    const length = getTokensLength(tokenizerModel, value)
    const isMaxLength = length > maxLength?.value

    setLength(length)
    setIsCounting(false)
    return isMaxLength ? maxLength.message : undefined
  },
  500
)

export const PromptEditor = ({
  editorContext,
  setEditorContext,
  label,
  about,
  placeholder,
  defaultValue,
  tokenizerModel,
  resizable = true,
  control,
  name,
  rules,
  triggerField,
}: IProps) => {
  const {
    field,
    fieldState: { error, isDirty },
  } = useController({
    name,
    control,
    rules: Object.assign({}, rules, {
      maxLength: undefined,
      validate: (value: string) =>
        validateTokens({
          value,
          tokenizerModel,
          maxLength,
          setLength,
          setIsCounting,
        }),
    }),
    defaultValue,
  })
  const maxLength = rules?.maxLength as { value: number; message: string }
  const [length, setLength] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const containerRef = useRef<HTMLDivElement>(null)
  const { i18n, t } = useTranslation()
  const pr = new Intl.PluralRules(i18n.language, { type: 'cardinal' })
  const suffixes = new Map([
    ['zero', t('tokenizer.count_suffixes.zero')],
    ['one', t('tokenizer.count_suffixes.one')],
    ['two', t('tokenizer.count_suffixes.two')],
    ['few', t('tokenizer.count_suffixes.few')],
    ['many', t('tokenizer.count_suffixes.many')],
    ['other', t('tokenizer.count_suffixes.other')],
  ])

  let cx = classNames.bind(s)
  const { skillPromptEdited } = useGaSkills()

  const handleTextEditorBlur = () => {
    field.onBlur()
    setIsActive(false)
  }

  const handleTextEditorChange = (value: string) => {
    skillPromptEdited()
    field.onChange(value)
  }

  useEffect(() => {
    if (isDirty) setIsActive(true)
    setIsCounting(true)

    const isEmpty = field.value?.length === 0

    if (isEmpty) {
      setLength(0)
      setIsCounting(false)
    }
    setEditorContext({ ...editorContext, code: field.value })
  }, [field.value])

  useEffect(() => {
    setEditorContext({ ...editorContext, code: field.value })
  }, [])

  useEffect(() => {
    const isValue = field.value?.length > 0
    const isOldValue = length > 0
    if (!isValue && triggerField && isOldValue) {
      setLength(0)
      triggerField(name)
    }
  }, [length])

  useEffect(() => {
    const isCheckable = triggerField && tokenizerModel && maxLength?.value

    if (!isCheckable) return
    triggerField(name)
    setIsCounting(true)
  }, [triggerField, tokenizerModel, maxLength?.value])

  return (
    <div
      className={cx('promptEditor')}
      data-active={isActive}
      data-error={error !== undefined}
    >
      {(label || maxLength?.value) && (
        <label className={cx('label', 'header')}>
          {label && <span className={s.title}>{label}</span>}
          {maxLength?.value && (
            <span className={s.counter}>
              {length}
              {isCounting && t('tokenizer.counting')}/{maxLength?.value}
              {` ` + t('tokenizer.count_label')}
              {suffixes.get(pr.select(length))}
            </span>
          )}
        </label>
      )}

      <div
        ref={containerRef}
        className={cx('container', resizable && 'resize-container')}
      >
        {resizable && <TextAreaLogo className={s.resizer} />}
        <div className={s.field}>
          <TextEditor
            editorContext={editorContext}
            setEditorContext={setEditorContext}
            placeholder={placeholder}
            onChange={handleTextEditorChange}
            onBlur={handleTextEditorBlur}
          />
        </div>
      </div>

      {(about || error) && (
        <label className={cx('label', 'about')}>
          {error ? <>{error.message}</> : about}
        </label>
      )}
    </div>
  )
}
