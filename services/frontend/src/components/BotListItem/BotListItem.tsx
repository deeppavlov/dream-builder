import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './BotListItem.module.scss'
import { BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { useAuth } from '../../services/AuthProvider'

interface BotListItemProps extends BotInfoInterface {
  checkbox?: boolean
  time?: string
  disabledMsg?: string
}

export const BotListItem = ({
  checkbox,
  name,
  author,
  desc,
  dateCreated,
  time,
  version,
  ram,
  gpu,
  space,
  disabledMsg,
}: BotListItemProps) => {
  const bot = {
    name,
    author,
    desc,
    dateCreated,
    time,
    version,
    ram,
    gpu,
    space,
  }
  const auth = useAuth()
  const handleBotListItemClick = () => {
    trigger('BotInfoSidePanel', bot)
  }

  const handleCloneBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('CreateAssistantModal', bot)
  }

  return (
    <tr className={s.tr} onClick={handleBotListItemClick}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <CheckBox />
        </td>
      )}
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.botName}>{name || 'Name of The Bot'}</p>
          <span className={s.params}>
            {`RAM ${ram} | GPU ${gpu} | DS ${space}`}
          </span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.author}>

          {author === 'DeepPavlov' ? (
            <Logo />
          ) : (
            <img src={auth?.user?.picture} referrerPolicy='no-referrer' />
          )}
          <p>{author}</p>

        </div>
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-for='descriptionTooltip'
          data-tip={desc}>
          <ReactTooltip
            id='descriptionTooltip'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
          {desc ||
            'Our fouray into building consumer-friendly virtual assistants. Clone to...'}
        </div>
      </td>
      <td className={s.td}>
        <SmallTag theme='version'>v{version || '0.3.4'}</SmallTag>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated || 'Dec 12, 2022'}</p>
          <p className={s.time}>{time || '5:21 PM '}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <div data-tip data-for='bot-clone-interact'>
            <button
              className={s.area}
              disabled={disabledMsg !== undefined}
              onClick={handleCloneBtnClick}>
              <Clone />
            </button>
          </div>
        </div>
      </td>
      {disabledMsg && (
        <ReactTooltip
          place='bottom'
          effect='solid'
          className='tooltips'
          arrowColor='#8d96b5'
          delayShow={1000}
          id='bot-clone-interact'>
          {disabledMsg}
        </ReactTooltip>
      )}
    </tr>
  )
}
