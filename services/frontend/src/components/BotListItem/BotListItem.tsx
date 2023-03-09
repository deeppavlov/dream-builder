import { FC } from 'react'
import ReactTooltip from 'react-tooltip'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { ReactComponent as PreviewIcon } from '@assets/icons/eye.svg'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import { useAuth } from '../../context/AuthProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import Button from '../../ui/Button/Button'
import { ReactComponent as Edit } from '../../assets/icons/edit_pencil.svg'
import s from './BotListItem.module.scss'

interface BotListItemProps extends BotInfoInterface {
  checkbox?: boolean
  time?: string
  disabledMsg?: string
  routingName: string
  type: BotAvailabilityType
}

export const BotListItem: FC<BotListItemProps> = ({
  checkbox,
  name,
  routingName,
  authorImg,
  author,
  desc,
  dateCreated,
  time,
  version,
  ram,
  gpu,
  space,
  disabledMsg,
  type,
}) => {
  const bot = {
    name,
    routingName,
    author,
    authorImg,
    desc,
    dateCreated,
    time,
    version,
    ram,
    gpu,
    space,
  }
  const auth = useAuth()
  const navigate = useNavigate()
  const handleBotListItemClick = () => {
    trigger(BASE_SP_EVENT, {
      children: <BotInfoSidePanel key={bot?.name} bot={bot} />,
    })
  }

  const handleCloneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    trigger('AssistantModal', { action: 'clone', bot: bot })
  }
  const handlePreviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${routingName}`, {
      state: { preview: true, distName: routingName, displayName: name },
    })
  }
  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${routingName}`, {
      state: { preview: false, distName: routingName, displayName: name },
    })
  }

  return (
    <tr className={s.tr} onClick={handleBotListItemClick}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <Checkbox />
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
          {/* {author === 'DeepPavlov' ? ( */}
          <Logo />
          {/* ) : ( */}
          {/* <img src={auth?.user?.picture} referrerPolicy='no-referrer' /> */}
          {/* )} */}
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
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated || 'Dec 12, 2022'}</p>
          <p className={s.time}>{time || '5:21 PM '}</p>
        </div>
      </td>
      <td className={s.td}>
        <div data-tip data-for='bot-clone-interact'>
          <div className={s.btns_area}>
            <Button
              theme='primary'
              small
              withIcon
              props={{
                disabled: disabledMsg !== undefined,
                onClick:
                  type === 'public' ? handleCloneClick : handlEditClick,
              }}>
              {type === 'public' ? <Clone /> : <Edit />}
            </Button>
            {type === 'your' ? (
              <Button theme='secondary' small withIcon>
                <Kebab
                  dataFor={type === 'your' && 'your_bot'}
                  item={{
                    typeItem: bot.routingName, // Id for ReactToolTip
                    data: bot, // Data of Element
                  }}
                />
              </Button>
            ) : (
              <Button
                theme='secondary'
                small
                withIcon
                props={{ onClick: handlePreviewClick }}>
                <PreviewIcon />
              </Button>
            )}
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
