import classNames from 'classnames/bind'
import React,{ FC,useEffect,useId,useState } from 'react'
import { FormState } from 'react-hook-form'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import Button from '../Button/Button'
import s from './TextArea.module.scss'

interface TextAreaProps {
  label?: string | JSX.Element
  about?: string | JSX.Element
  error?: Partial<{ type: any; message: any }>
  formState?: FormState<any>
  maxLenght?: number | string
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  withCounter?: boolean
  withWordCounter?: boolean
  withEnterButton?: boolean
  resizable?: boolean
  fullHeight?: boolean
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  about,
  error,
  formState,
  maxLenght,
  props,
  withCounter,
  withWordCounter,
  withEnterButton,
  resizable = true,
  fullHeight,
}) => {
  const [isActive, setIsActive] = useState(false) // for manage focus state (for styles)
  const [isEnter, setIsEnter] = useState(false) // for display Enter button
  const [value, setValue] = useState(props?.defaultValue || '')
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
      data-error={error !== undefined}>
      {(label || withCounter) && (
        <label htmlFor={textAreaId} className={s.label}>
          {label && <span className={s.title}>{label}</span>}
          {withCounter && (
            <span className={s.counter}>
              {value?.toString()?.length ?? 0}/{maxLenght}
            </span>
          )}
          {withWordCounter && (
            <span className={s.counter}>
              {value?.split(' ')?.length ?? 0}/{maxLenght} words
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
