import { FC, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  BotAvailabilityType,
  BotInfoInterface,
  ISkill,
  StackType,
} from '../../types/types'
import { trigger } from '../../utils/events'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import { getComponents } from '../../services/getComponents'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import useTabsManager from '../../hooks/useTabsManager'
import { srcForIcons } from '../../utils/srcForIcons'
import { componentTypeMap } from '../../Mapping/componentTypeMap'
import { isAnnotator } from '../../utils/isAnnotator'
import { modelTypeMap } from '../../Mapping/modelTypeMap'
import { Loader } from '../Loader/Loader'
import s from './BotInfoSidePanel.module.scss'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import { dateToUTC } from '../../utils/dateToUTC'
import { SmallTag } from '../SmallTag/SmallTag'

interface Props {
  bot: BotInfoInterface
  disabled?: boolean
  type: BotAvailabilityType
}

const BotInfoSidePanel: FC<Props> = ({ bot: propBot, disabled, type }) => {
  const [bot, setBot] = useState<BotInfoInterface>(propBot)
  const [properties] = ['Properties']
  const navigate = useNavigate()
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: properties,
    tabList: new Map([[properties, { name: properties }]]),
  })
  const {
    isLoading: isComponentsLoading,
    error: componentsError,
    data: components,
  } = useQuery(['components', bot?.name], () => getComponents(bot?.name!))
  const tooltipId = useId()

  const handleCloneBtnClick = () => {
    if (!disabled) {
      trigger('AssistantModal', { action: 'clone', bot: bot })
      return
    }

    trigger('SignInModal', {})
  }

  const handlePreviewBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${bot?.name}`, {
      state: {
        preview: true,
        distName: bot?.name,
        displayName: bot?.name,
      },
    })
  }
  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/${bot?.name}`, {
      state: {
        preview: false,
        distName: bot?.name,
        displayName: bot?.display_name,
      },
    })
    e.stopPropagation()
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
          <span className={s.name}>{bot?.display_name}</span>
        </div>
        <div className={s.topContainer}>
          <div className={s.author}>
            <img src={DeepPavlovLogo} alt='Author' />
            <span>{bot?.author.fullname}</span>
          </div>
          <span className={s.separator} />
          <div className={s.dateAndVersion}>
            <div className={s.date}>
              <CalendarIcon />
              {dateToUTC(bot?.date_created)}
            </div>
            <SmallTag theme={type}>
              {type === 'your' ? 'Private' : type}
            </SmallTag>
          </div>
        </div>
        <div className={s.scroll}>
          <div className={s.container}>
            <p className={s.desc}>{bot?.description}</p>
            <div className={s.accordions}>
              <Loader isLoading={isComponentsLoading} />
              {components &&
                Object.keys(components).map((group: string, id: number) => (
                  <Accordion
                    key={id}
                    title={capitalizeTitle(group)}
                    group={group as StackType}
                    closed
                    rounded>
                    {group == 'skill_selectors' &&
                      components?.skill_selectors?.length == 0 && (
                        <div className={s.accordionItem}>All Skills</div>
                      )}
                    {group !== 'skill_selectors' &&
                      components[group]?.length == 0 && (
                        <div className={s.accordionItem}>None</div>
                      )}
                    {components[group].map((item: ISkill, id: number) => (
                      <div key={id} className={s.accordionItem}>
                        {group === 'skills' && (
                          <img
                            className={s.icon}
                            src={srcForIcons(
                              componentTypeMap[item?.component_type || '']
                            )}
                          />
                        )}
                        {isAnnotator(group) && (
                          <img
                            className={s.icon}
                            src={srcForIcons(
                              modelTypeMap[item?.model_type || '']
                            )}
                          />
                        )}
                        {item?.display_name}
                      </div>
                    ))}
                  </Accordion>
                ))}
            </div>
          </div>
        </div>
        <div className={s.btns}>
          {type === 'public' && (
            <>
              <Button
                theme='secondary'
                props={{ onClick: handlePreviewBtnClick }}>
                Preview
              </Button>
              <Button theme='primary' props={{ onClick: handleCloneBtnClick }}>
                Clone
              </Button>
            </>
          )}
          {type === 'your' && (
            <>
              <Button
                props={{ 'data-tooltip-id': tooltipId }}
                theme='secondary'>
                More
              </Button>
              <Button props={{ onClick: handlEditClick }} theme='primary'>
                Edit
              </Button>
              <BotCardToolTip tooltipId={tooltipId} bot={bot} type={type} />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BotInfoSidePanel
