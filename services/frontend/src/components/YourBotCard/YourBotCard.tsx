import ReactTooltip from 'react-tooltip'
import Calendar from '../../assets/icons/calendar.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { trigger } from '../../utils/events'
import { BotInfoInterface } from '../../types/types'
import Button from '../../ui/Button/Button'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './YourBotCard.module.scss'

interface YourBotCardProps extends BotInfoInterface {
  disabledMsg?: string
}

export const YourBotCard = (bot: Partial<YourBotCardProps>) => {
  const {
    name,
    author,
    desc,
    dateCreated,
    version,
    ram,
    gpu,
    space,
    disabledMsg,
  } = bot

  const handleBotCardClick = () => {
    trigger('BotInfoSidePanel', bot)
  }

  const handleCloneBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('CreateAssistantModal', bot)
  }

  return (
    <div className={s.card} onClick={handleBotCardClick}>
      <div className={s.header}>
        <h6>{name} </h6>
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.info}>
            <p>{desc}</p>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p style={{ fontSize: '14px' }}>{dateCreated}</p>
            </div>
            <SmallTag theme='version'>v{version}</SmallTag>
          </div>
        </div>
        <span className={s.separator} />
        <div className={s.middle}>
          <ul className={s.params}>
            <li>
              <p className={s.params_item}>RAM</p>
              <p className={s.params_item__units}>{ram ?? '0.0 GB'}</p>
            </li>
            <li>
              <p className={s.params_item}>GPU</p>
              <p className={s.params_item__units}>{gpu ?? '0.0 GB'}</p>
            </li>
            <li>
              <p className={s.params_item}>Disk Space</p>
              <p className={s.params_item__units}>{space ?? '0.0 GB'}</p>
            </li>
          </ul>
        </div>
        <div className={s.bottom}>
          <div className={s.btns_area}>
            <div
              data-tip
              data-for='bot-clone-interact'
              style={{ width: '100%' }}>
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
            <div className={s.kebab}>
              <KebabButton dataFor='your_bot' />
            </div>
          </div>
        </div>
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
