import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { useQuery } from 'react-query'
import { BotInfoInterface, StackType } from '../../types/types'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { useAuth } from '../../services/AuthProvider'
import { getComponentsFromAssistantDists } from '../../services/getComponentsFromAssistantDists'
import { ReactComponent as DeepPavlovLogo } from '@assets/icons/deeppavlov_logo_round.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import DateCard from '../DateCard/DateCard'
import s from './BotInfoSidePanel.module.scss'
import { isSelector } from '../../utils/isSelector'

interface BotInfoSidePanelProps extends Partial<SidePanelProps> {
  disabledMsg?: string
}

const BotInfoSidePanel = ({ position, disabledMsg }: BotInfoSidePanelProps) => {
  const auth = useAuth()
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const {
    isLoading: isDistsComponentsLoading,
    error: distsComponentsError,
    data: distsComponentsData,
  } = useQuery(
    ['distsComponents', bot?.routingName],
    () => getComponentsFromAssistantDists(bot?.routingName!),
    {
      enabled: isOpen,
    }
  )
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
          <div className={s.header}>
            <span className={s.name}>{name}</span>
            <SmallTag theme='version'>v{version}</SmallTag>
          </div>
          <div className={s.container}>
            <div className={s.main}>
              <DateCard date={dateCreated} />
              <div className={s.table}>
                <div className={s.author}>
                  {author === 'DeepPavlov' ? (
                    <DeepPavlovLogo />
                  ) : (
                    <img src={auth?.user?.picture} />
                  )}
                  <span>Made by {author}</span>
                </div>
                <ul className={s.table}>
                  <li>
                    <span>RAM:</span>
                    <span className={s.tableCount}>{ram ?? '0.0 GB'}</span>
                  </li>
                  <li>
                    <span>GPU:</span>
                    <span className={s.tableCount}>{gpu ?? '0.0 GB'}</span>
                  </li>
                  <li>
                    <span>Disk space:</span>
                    <span className={s.tableCount}>{space ?? '0.0 GB'}</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className={s.desc}>{desc}</p>
          </div>
          <div className={s.accordions}>
            {isDistsComponentsLoading && <>{'Loading...'}</>}
            {distsComponentsData &&
              Object.keys(distsComponentsData).map(
                (group: string, id: number) => (
                  <Accordion
                    key={id}
                    title={capitalizeTitle(group)}
                    group={group}
                    closed
                    rounded>
                    {group == 'skill_selectors' &&
                      distsComponentsData.skill_selectors?.length == 0 && (
                        <div className={s.accordionItem}>{'All Skills'}</div>
                      )}
                    {distsComponentsData[group].map(
                      (item: object, id: number) => (
                        <div key={id} className={s.accordionItem}>
                          {!isSelector(group) && (
                            <img
                              className={s.icon}
                              src={`./src/assets/icons/${item.type}.svg`}
                            />
                          )}
                          {item.display_name}
                        </div>
                      )
                    )}
                  </Accordion>
                )
              )}
          </div>
          <div className={s.btns}>
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
