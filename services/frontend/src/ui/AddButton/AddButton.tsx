import { FC, useId } from 'react'
import Add from '../../assets/icons/+.svg'
import BaseToolTip from '../../components/BaseToolTip/BaseToolTip'
import { useAuth } from '../../context/AuthProvider'
import { trigger } from '../../utils/events'
import s from './AddButton.module.scss'

interface Props {
  text?: string
  listView?: boolean
  disabled?: boolean
}

export const AddButton: FC<Props> = ({ text, listView, disabled }) => {
  const tooltipId = useId()
  const auth = useAuth()

  const addBot = () => {
    trigger('AssistantModal', { action: 'create' })
  }

  const handleClick = () => addBot()

  const disabledMsg = !auth?.user
    ? 'You must be signed in to create your own bot'
    : undefined

  return (
    <>
      {!listView ? (
        <button
          data-tip
          data-tooltip-id={tooltipId}
          onClick={handleClick}
          className={s.forCard}
          disabled={disabled || disabledMsg !== undefined}>
          <img src={Add} />
        </button>
      ) : (
        <tr className={s.tr}>
          <td colSpan={5} className={s.td}>
            <button
              data-tip
              data-tooltip-id={tooltipId}
              className={s.forTable}
              onClick={handleClick}
              disabled={disabled || disabledMsg !== undefined}>
              <img src={Add} />
              <p>{text || 'Create From Scratch'}</p>
            </button>
          </td>
        </tr>
      )}
      {disabledMsg && (
        <BaseToolTip
          id={tooltipId}
          content={disabledMsg}
          theme='small'
          place='top'
        />
      )}
    </>
  )
}
