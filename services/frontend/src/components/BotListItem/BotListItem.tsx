import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import { BotCardProps } from '../BotCard/BotCard'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './BotListItem.module.scss'

interface BotListItemProps extends BotCardProps {
  checkbox?: boolean
  time: string
}

export const BotListItem = ({
  checkbox,
  botName,
  companyName,
  description,
  date,
  time,
  version,
  ram,
  gpu,
  space,
}: BotListItemProps) => {
  return (
    <tr className={s.tr}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <CheckBox />
        </td>
      )}
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.botName}>{botName || 'Name of The Bot'}</p>
          <span className={s.params}>
            {'RAM ' + ram || '60.0GB'} | {'GPU ' + gpu || '65.0 GB'} |{' '}
            {'DS ' + space || '300GB'}
          </span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.author}>
          <Logo />
          <p>{companyName || 'DeepPavlov'}</p>
        </div>
      </td>
      <td className={s.td}>
        <p className={s.description}>
          {description ||
            'Our fouray into building consumer-friendly virtual assistants. Clone to...'}
        </p>
      </td>
      <td className={s.td}>
        <SmallTag theme='version'>v{version || '0.3.4'}</SmallTag>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{date || 'Dec 12, 2022'}</p>
          <p className={s.time}>{time || '5:21 PM '}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <Link to='/editor'>
            <button className={s.area}>
              <Clone />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  )
}
