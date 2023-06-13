import { ReactComponent as EditIcon } from 'assets/icons/edit_pencil.svg'
import { trigger } from 'utils/events'
import s from './IntentListItem.module.scss'

export interface IntentListItemInterface {
  id: string
  name: string
  about?: string
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
}

const IntentListItem = ({
  name,
  about,
  status,
  disabled,
}: IntentListItemInterface) => {
  const handleEditButtonClick = () => trigger('IntentCatcherModal', [])

  return (
    <div
      className={`${s.intentListItem} ${
        status ? s.intentListItem_status : ''
      } ${status ? s[`intentListItem_status_${status}`] : ''}`}
      data-disabled={disabled}
    >
      <div className={s.intentListItem__container}>
        <span className={s.intentListItem__name}>{name}</span>
        <p className={s.intentListItem__about}>{about}</p>
      </div>
      <button
        className={s.intentListItem__edit}
        onClick={handleEditButtonClick}
        disabled={disabled}
      >
        <EditIcon />
      </button>
    </div>
  )
}

export default IntentListItem
