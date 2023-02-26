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
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import useTabsManager from '../../hooks/useTabsManager'

interface Props {
  bot: BotInfoInterface
  disabledMsg?: string
}

const BotInfoSidePanel = ({ bot: propBot, disabledMsg }: Props) => {
  const auth = useAuth()
  const [bot, setBot] = useState<BotInfoInterface>(propBot)
  const [properties] = ['Properties']
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: properties,
    tabList: new Map([[properties, { name: properties }]]),
  })

  const {
    isLoading: isDistsComponentsLoading,
    error: distsComponentsError,
    data: distsComponentsData,
  } = useQuery(
    ['distsComponents', bot?.routingName],
    () => getComponentsFromAssistantDists(bot?.routingName!),
    {
      // enabled: isOpen,
    }
  )

  const handleCloneBtnClick = () => {
    trigger('CreateAssistantModal', bot)
  }

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          {Array.from(tabsInfo.tabs).map(([id, tab]) => (
            <li
              role='tab'
              data-disabled={tab.disabled}
              key={id}
              aria-selected={tabsInfo.activeTabId === id}
              onClick={() => tabsInfo.handleTabSelect(id)}>
              {tab.name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      <div className={s.botInfoSidePanel}>
        <div className={s.header}>
          <span className={s.name}>{bot.name}</span>
          <SmallTag theme='version'>v{bot.version}</SmallTag>
        </div>
        <div className={s.container}>
          <div className={s.main}>
            <DateCard date={bot.dateCreated} />
            <div className={s.table}>
              <div className={s.author}>
                <img src={bot.authorImg} alt='Author' />
                <span>{bot.author}</span>
              </div>
              <ul className={s.table}>
                <li>
                  <span>RAM:</span>
                  <span className={s.tableCount}>{bot.ram ?? '0.0 GB'}</span>
                </li>
                <li>
                  <span>GPU:</span>
                  <span className={s.tableCount}>{bot.gpu ?? '0.0 GB'}</span>
                </li>
                <li>
                  <span>Disk space:</span>
                  <span className={s.tableCount}>{bot.space ?? '0.0 GB'}</span>
                </li>
              </ul>
            </div>
          </div>
          <p className={s.desc}>{bot.desc}</p>
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
                      <div className={s.accordionItem}>All Skills</div>
                    )}
                  {group !== 'skill_selectors' &&
                    distsComponentsData[group].length == 0 && (
                      <div className={s.accordionItem}>None</div>
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
    </>
  )
}

export default BotInfoSidePanel
