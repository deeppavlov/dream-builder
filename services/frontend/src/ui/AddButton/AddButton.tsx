import { FC } from 'react'
import Add from '../../assets/icons/+.svg'
import { trigger } from '../../utils/events'
import s from './AddButton.module.scss'

interface Props {
  text?: string
  addBot: () => void
  listView?: boolean
  disabled?: boolean
}

export const AddButton: FC<Props> = ({ text, addBot, listView, disabled }) => {
  const handleClick = () => {
    if (disabled) {
      trigger('SignInModal', {})
      return
    }

    addBot()
  }

  return !listView ? (
    <button onClick={handleClick} className={s.forCard}>
      <img src={Add} />
    </button>
  ) : (
    <tr className={s.tr}>
      <td colSpan={5} className={s.td}>
        <button className={s.forTable} onClick={handleClick}>
          <img src={Add} />
          <p>{text || 'Create From Scratch'}</p>
        </button>
      </td>
    </tr>
  )
}
