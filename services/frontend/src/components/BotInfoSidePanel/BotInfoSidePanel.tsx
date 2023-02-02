import { ReactComponent as DeepPavlovLogo } from '@assets/icons/deeppavlov_logo_round.svg'
import { ReactComponent as FallbackIcon } from '@assets/icons/fallbacks.svg'
import { ReactComponent as SkillScriptIcon } from '@assets/icons/skill_script.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import DateCard from '../DateCard/DateCard'
import { useEffect, useState } from 'react'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import { BotInfoInterface } from '../../types/types'
import s from './BotInfoSidePanel.module.scss'
import ReactTooltip from 'react-tooltip'
import { useAuth } from '../../Router/AuthProvider'

interface BotInfoSidePanelProps extends Partial<SidePanelProps> {
  disabledMsg?: string
}

const BotInfoSidePanel = ({ position, disabledMsg }: BotInfoSidePanelProps) => {
  const auth = useAuth()
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Set panel is open and getting bot info
   */
  const handleEventUpdate = (data: { detail: BotInfoInterface }) => {
    setBot(data.detail)
    setIsOpen(!isOpen)
  }

  const handleCloneBtnClick = () => {
    trigger('CreateAssistantModal', bot)
  }

  useEffect(() => {
    subscribe('BotInfoSidePanel', handleEventUpdate)

    return () => unsubscribe('BotInfoSidePanel', handleEventUpdate)
  }, [])

  if (bot) {
    const { name, version, dateCreated, author, desc, ram, gpu, space } = bot

    return (
      <BaseSidePanel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        position={position}
        name='Properties'>
        <div className={s.botInfoSidePanel}>
          <div className={s.botInfoSidePanel__header}>
            <span className={s.botInfoSidePanel__name}>{name}</span>
            <SmallTag theme='version'>v{version}</SmallTag>
          </div>
          <div className={s.botInfoSidePanel__container}>
            <div className={s.botInfoSidePanel__main}>
              <DateCard date={dateCreated} />
              <div className={s.botInfoSidePanel__table}>
                <div className={s.botInfoSidePanel__author}>
                  {author === 'DeepPavlov' ? (
                    <DeepPavlovLogo />
                  ) : (
                    <img src={auth?.user?.picture} />
                  )}
                  <span>Made by {author}</span>
                </div>
                <ul className={s.resourcesBlock__table}>
                  <li>
                    <span>RAM:</span>
                    <span className={s['resourcesBlock__table-count']}>
                      {ram ?? '0.0 GB'}
                    </span>
                  </li>
                  <li>
                    <span>GPU:</span>
                    <span className={s['resourcesBlock__table-count']}>
                      {gpu ?? '0.0 GB'}
                    </span>
                  </li>
                  <li>
                    <span>Disk space:</span>
                    <span className={s['resourcesBlock__table-count']}>
                      {space ?? '0.0 GB'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <p className={s.botInfoSidePanel__desc}>{desc}</p>
          </div>
          <div className={s.botInfoSidePanel__accordions}>
            <Accordion title='Annotators' rounded></Accordion>
            <Accordion title='Skills' rounded>
              {/* <div className={s['botInfoSidePanel__accordion-item']}>
                <SkillScriptIcon />
                DFF Program-Y Skill
              </div>
              <div className={s['botInfoSidePanel__accordion-item']}>
                <SkillScriptIcon />
                DFF Intent Responder Skill
              </div>
              <div className={s['botInfoSidePanel__accordion-item']}>
                <FallbackIcon /> Dummy Skill
              </div> */}
            </Accordion>
          </div>
          <div className={s.botInfoSidePanel__btns}>
            <div data-tip data-for='bot-clone-interact'>
              <Button
                theme='primary'
                props={{
                  disabled: disabledMsg !== undefined,
                  onClick: handleCloneBtnClick,
                }}>
                Clone
              </Button>
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
      </BaseSidePanel>
    )
  }

  return null
}

export default BotInfoSidePanel
