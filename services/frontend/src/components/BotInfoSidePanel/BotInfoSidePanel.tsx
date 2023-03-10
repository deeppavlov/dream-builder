import { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BotInfoInterface, SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { getComponentsFromAssistantDists } from '../../services/getComponentsFromAssistantDists'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import DateCard from '../DateCard/DateCard'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import useTabsManager from '../../hooks/useTabsManager'
import { srcForIcons } from '../../utils/srcForIcons'
import { componentTypeMap } from '../../Mapping/componentTypeMap'
import { isAnnotator } from '../../utils/isAnnotator'
import { modelTypeMap } from '../../mapping/modelTypeMap'
import s from './BotInfoSidePanel.module.scss'
import { useAuth } from '../../context/AuthProvider'

interface Props {
  bot: BotInfoInterface
  disabledMsg?: string
}

const BotInfoSidePanel = ({ bot: propBot, disabledMsg }: Props) => {
  const auth = useAuth()
  const [bot, setBot] = useState<BotInfoInterface>(propBot)
  const [properties] = ['Properties']
  const navigate = useNavigate()
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: properties,
    tabList: new Map([[properties, { name: properties }]]),
  })

  const {
    isLoading: isDistsComponentsLoading,
    error: distsComponentsError,
    data: distsComponentsData,
  } = useQuery(['distsComponents', bot?.routingName], () =>
    getComponentsFromAssistantDists(bot?.routingName!)
  )

  const handleCloneBtnClick = () => {
    trigger('AssistantModal', { action: 'clone', bot: bot })
  }
  const handlePreviewBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${bot?.routingName}`, {
      state: {
        preview: true,
        distName: bot?.routingName,
        displayName: bot?.name,
      },
    })
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
          <span className={s.name}>{bot?.name}</span>
        </div>
        <div className={s.topContainer}>
          <div className={s.main}>
            <DateCard date={bot?.dateCreated} />
            <div className={s.table}>
              <div className={s.author}>
                <img src={bot?.authorImg} alt='Author' />
                <span>{bot?.author}</span>
              </div>
              <ul className={s.table}>
                <li>
                  <span>RAM:</span>
                  <span className={s.tableCount}>{bot?.ram ?? '0.0 GB'}</span>
                </li>
                <li>
                  <span>GPU:</span>
                  <span className={s.tableCount}>{bot?.gpu ?? '0.0 GB'}</span>
                </li>
                <li>
                  <span>Disk space:</span>
                  <span className={s.tableCount}>{bot?.space ?? '0.0 GB'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={s.container}>
          <p className={s.desc}>{bot?.desc}</p>
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
                      distsComponentsData?.skill_selectors?.length == 0 && (
                        <div className={s.accordionItem}>All Skills</div>
                      )}
                    {group !== 'skill_selectors' &&
                      distsComponentsData[group]?.length == 0 && (
                        <div className={s.accordionItem}>None</div>
                      )}
                    {distsComponentsData[group].map(
                      (item: SkillInfoInterface, id: number) => (
                        <div key={id} className={s.accordionItem}>
                          {group === 'skills' && (
                            <img
                              className={s.icon}
                              src={srcForIcons(
                                componentTypeMap[item?.component_type]
                              )}
                            />
                          )}
                          {isAnnotator(group) && (
                            <img
                              className={s.icon}
                              src={srcForIcons(modelTypeMap[item?.model_type])}
                            />
                          )}
                          {item?.display_name}
                        </div>
                      )
                    )}
                  </Accordion>
                )
              )}
          </div>
        </div>
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handlePreviewBtnClick }}>
            Preview
          </Button>
          <div data-tip data-for='bot-clone-interact'>
            <Button
              theme='primary'
              props={{
                disabled: auth?.user === null, // ??????????
                // disabledMsg !== undefined,
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
