import React, { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import Button from '../Button/Button'
import s from './TextArea.module.scss'

interface TextAreaProps {
  label?: string | JSX.Element
  about?: string | JSX.Element
  error?: Partial<{ type: any; message: any }>
  props?: React.InputHTMLAttributes<HTMLTextAreaElement>
  onEnterPress?: (value: string | null) => void
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  about,
  error,
  props,
  onEnterPress,
}) => {
  const [value, setValue] = useState<string | null>(
    props?.value?.toString() ?? null
  )
  const [isActive, setIsActive] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const textAreaId = props?.id ?? useId()
  let cx = classNames.bind(s)

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (props?.onBlur) props.onBlur(e)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props?.onChange) props.onChange(e)
    setValue(e.target.value)
    setIsActive(true)
    setIsChanged(true)
  }

  const handleEnterBtnClick = () => {
    onEnterPress && onEnterPress(value)
    setIsActive(false)
    setIsChanged(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onEnterPress && event.key === 'Enter') {
      event.preventDefault()
      handleEnterBtnClick()
    }
  }

  return (
    <div className={s.textArea} data-active={isActive} data-error={error !== undefined}>
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
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={s.field}
        />

        {onEnterPress && (
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

      {(about || error) && (
        <label htmlFor={textAreaId} className={s.label}>
          {error ? error.message : about}
        </label>
      )}
    </div>
  )
}
