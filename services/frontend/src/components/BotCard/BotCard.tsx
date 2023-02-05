import ReactTooltip from 'react-tooltip'
import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import CompanyLogo from '@assets/icons/pavlovInCard.svg'
import { ReactComponent as SaveIcon } from '@assets/icons/save.svg'
import Button from '../../ui/Button/Button'
import { trigger } from '../../utils/events'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { SmallTag } from '../SmallTag/SmallTag'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import s from './BotCard.module.scss'

interface BotCardProps extends BotInfoInterface {
  type: BotAvailabilityType
  size?: 'small' | 'big'
  disabledMsg?: string
  routingName: string
}

export const BotCard = ({
  type,
  name,
  routingName,
  author,
  authorImg,
  desc,
  dateCreated,
  version,
  ram,
  gpu,
  space,
  size,
  disabledMsg,
}: BotCardProps) => {
  const bot = {
    routingName,
    name,
    author,
    desc,
    dateCreated,
    version,
    ram,
    gpu,
    space,
  }

  const handleBotCardClick = () => {
    trigger('BotInfoSidePanel', bot)
  }

  const handleCloneBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('AssistantModal', { action: 'clone', distribution: bot })
  }

  return (
    <div
      className={`${s.botCard} ${s[`botCard_type_${type}`]} ${
        size === 'small' ? s.botCard_small : ''
      } ${size === 'big' ? s.botCard_big : ''}`}
      onClick={handleBotCardClick}>
      <div className={s.botCard__name}>{name}</div>
      <div className={s.botCard__block}>
        {type === 'public' && (
          <div className={s.botCard__author}>
            <img
              className={s['botCard__author-img']}
              referrerPolicy='no-referrer'
              src={authorImg}
            />
            <span>{author}</span>
          </div>
        )}
        <div
          className={s.botCard__desc}
          data-for='descriptionTooltip'
          data-tip={desc}>
          {desc}

          <ReactTooltip
            id='descriptionTooltip'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
        </div>
        <div className={s.botCard__dateAndVersion}>
          <div className={s.botCard__date}>
            <CalendarIcon />
            {dateCreated}
          </div>
          <SmallTag theme='version'>v{version}</SmallTag>
        </div>
        <span className={s.separator} />
      </div>
      <div className={s.botCard__resources}>
        <ResourcesTable
          values={[
            {
              name: 'RAM',
              value: ram || '0.0GB',
            },
            {
              name: 'GPU',
              value: gpu || '0.0GB',
            },
            {
              name: 'Disk Space',
              value: space || '0.0GB',
            },
          ]}
        />
      </div>
      <div className={s.botCard__btns}>
        {type === 'public' ? (
          <div data-tip data-for='bot-clone-interact' style={{ width: '100%' }}>
            <Button
              theme='primary'
              small
              long
              props={{
                disabled: disabledMsg !== undefined,
                onClick: handleCloneBtnClick,
              }}>
              Clone
            </Button>
          </div>
        ) : (
          <>
            <Button theme='secondary' small long>
              Edit
            </Button>
            <Button theme='secondary' small withIcon>
              <SaveIcon />
            </Button>
          </>
        )}
      </div>

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
    </div>
  )
}
