import React from 'react'
import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import s from './TextArea.module.scss'

export const TextArea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => {
  return (
    <div className={s["textArea-wrapper"]}>
      <textarea className={s.textArea} rows={2} cols={20} {...props}></textarea>
      <TextAreaLogo className={s['textArea-resizer']} />
    </div>
  )
}
