import { FC } from 'react'
import Add from '../../assets/icons/+.svg'
import s from './AddButton.module.scss'

interface Props {
  text?: string
  addBot: () => void
  listView?: boolean
  disabled?: boolean
}

export const AddButton: FC<Props> = ({ text, addBot, listView, disabled }) => {
  const handleClick = () => addBot()
  return (
    <>
      {!listView ? (
        <button onClick={handleClick} className={s.forCard} disabled={disabled}>
          <img src={Add} />
        </button>
      ) : (
        <tr className={s.tr}>
          <td colSpan={5} className={s.td}>
            <button
              className={s.forTable}
              onClick={handleClick}
              disabled={disabled}>
              <img src={Add} />
              <p>{text || 'Create From Scratch'}</p>
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
