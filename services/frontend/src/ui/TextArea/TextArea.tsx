import { ReactComponent as TextAreaLogo } from '../../assets/icons/textarea.svg'
import s from './TextArea.module.scss'

export const TextArea = ({ label }: any) => {
  return (
    <form className={s.form}>
      <label className={s.label} htmlFor='textArea'>
        {label}
      </label>
      <br />
      <textarea
        rows={2}
        cols={20}
        id='textArea'
        name='textArea'
        className={s.textArea}></textarea>
      <TextAreaLogo />
    </form>
  )
}
