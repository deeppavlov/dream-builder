import { FC, useId } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { ReactComponent as PreviewIcon } from '@assets/icons/eye.svg'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { SmallTag } from '../SmallTag/SmallTag'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import { useAuth } from '../../Context/AuthProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import Button from '../../ui/Button/Button'
import { ReactComponent as Edit } from '../../assets/icons/edit_pencil.svg'
import s from './BotListItem.module.scss'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import BaseToolTip from '../BaseToolTip/BaseToolTip'

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
  const navigate = useNavigate()
  const tooltipId = useId()

  const handleBotListItemClick = () => {
    trigger(BASE_SP_EVENT, {
      children: (
        <BotInfoSidePanel key={bot?.name} bot={bot} disabledMsg={disabledMsg} />
      ),
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
          data-tooltip-id={'botTableDesc' + tooltipId}>
          {desc}
          <BaseToolTip
            id={'botTableDesc' + tooltipId}
            content={desc}
            place='bottom'
            theme='description'
          />
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated || 'Dec 12, 2022'}</p>
          <p className={s.time}>{time || '5:21 PM '}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <div data-tip data-tooltip-id={'botClone' + tooltipId}>
            <Button
              theme='primary'
              small
              withIcon
              props={{
                disabled: disabledMsg !== undefined,
                onClick: type === 'public' ? handleCloneClick : handlEditClick,
              }}>
              {type === 'public' ? <Clone /> : <Edit />}
            </Button>
          </div>

          {type === 'your' ? (
            <>
              <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
              <BotCardToolTip
                tooltipId={'ctxMenu' + tooltipId}
                bot={bot}
                type={type}
              />
            </>
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
      </td>
      {disabledMsg && (
        <BaseToolTip
          id={'botClone' + tooltipId}
          content={disabledMsg}
          place='bottom'
          theme='small'
        />
      )}
    </tr>
  )
}
