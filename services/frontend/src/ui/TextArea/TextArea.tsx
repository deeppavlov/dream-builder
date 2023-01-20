import React, { FC, useState } from 'react'
import { nanoid } from 'nanoid'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import s from './TextArea.module.scss'
import Button from '../Button/Button'

interface TextAreaProps {
  label?: string | JSX.Element
  about?: string | JSX.Element
  errorMessage?: string | JSX.Element | null
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  onSubmit?: (value: string) => void
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
  const [value, setValue] = useState(props?.value)
  const [isActive, setIsActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState(errorMessage)
  const textAreaId = nanoid(8)

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e)

    const targetValue = e.target.value
    const valueIsEmpty = targetValue.length === 0

    setValue(targetValue)

    if (valueIsEmpty) {
      setIsActive(false)
      return
    }

    setIsActive(true)
  }

  const handleEnterBtnClick = () => {
    setIsActive(false)
    setValue('')

    if (onSubmit && value !== undefined && value !== '') {
      onSubmit(value.toString())
    }
  }

  return (
    <div className={s.textArea}>
      {label && (
        <label htmlFor={textAreaId} className={s.textArea__label}>
          {label}
        </label>
      )}
      <div className={`${s.textArea__container} ${s.resizer}`}>
        <TextAreaLogo
          className={`${s['textArea-resizer']} ${s.textArea__resizer}`}
        />

        <textarea
          {...props}
          id={textAreaId}
          value={value}
          rows={2}
          cols={20}
          onChange={handleTextAreaChange}
          className={`${s.textArea__field} ${
            isActive ? s.textArea__field_active : ''
          } ${errorMsg ? s.textArea__field_error : ''}`}
        />

        {onSubmit && (
          <div className={s.textArea__submit}>
            <Button
              theme='tertiary'
              small
              props={{ onClick: handleEnterBtnClick }}>
              Enter
            </Button>
          </div>
        )}
      </div>

      {(about || errorMsg) && (
        <label
          htmlFor={textAreaId}
          className={`${s.textArea__label} ${
            errorMsg ? s['textArea__error-msg'] : ''
          }`}>
          {errorMsg ?? about}
        </label>
      )}
    </div>
  )
}
