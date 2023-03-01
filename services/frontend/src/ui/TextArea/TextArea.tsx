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
  withCounter?: boolean
  withEnterButton?: boolean
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  about,
  error,
  props,
  withCounter,
  withEnterButton,
}) => {
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const [isChanged, setIsChanged] = useState(false) // for displaying Enter button
  const [value, setValue] = useState('')
  const textAreaId = props?.id ?? useId()
  const maxLenght = 500
  let cx = classNames.bind(s)

  /** On Enter press set focused state for textarea */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') handleEnterBtnClick()
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (props?.onBlur) props.onBlur(e)
    setIsActive(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props?.onChange) props.onChange(e)

    setValue(e.target.value)

    if (!e.target.value) {
      handleEnterBtnClick()
      return
    }

    setIsActive(true)
    setIsChanged(true)
  }

  const handleEnterBtnClick = () => {
    setIsActive(false)
    setIsChanged(false)
  }

  return (
    <div
      className={s.textArea}
      data-active={isActive}
      data-error={error !== undefined}>
      {(label || withCounter) && (
        <label htmlFor={textAreaId} className={s.label}>
          {label && <span className={s.title}>{label}</span>}
          {withCounter && (
            <span className={s.counter}>
              {value?.length ?? 0}/{maxLenght}
            </span>
          )}
        </label>
      )}
      <div className={cx('container', 'resizer-container')}>
        <TextAreaLogo className={s.resizer} />
        <textarea
          {...props}
          id={textAreaId}
          rows={2}
          cols={20}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={s.field}
        />

        {withEnterButton && (
          <div className={cx('submit', isChanged && 'submit-active')}>
            <Button
              theme='tertiary'
              small
              props={{ type: 'submit', onClick: handleEnterBtnClick }}>
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
