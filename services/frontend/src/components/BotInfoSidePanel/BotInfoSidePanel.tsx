import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import { FC, useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Woman from '../../assets/icons/woman.png'
import { useDisplay } from '../../context/DisplayContext'
import useTabsManager from '../../hooks/useTabsManager'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './BotInfoSidePanel.module.scss'

interface Props {
  bot: BotInfoInterface
  disabled?: boolean
  type: BotAvailabilityType
}

const BotInfoSidePanel: FC<Props> = ({ bot: propBot, disabled, type }) => {
  const [bot] = useState<BotInfoInterface>(propBot)
  const [properties] = ['Properties']
  const navigate = useNavigate()
  const [tabsInfo] = useTabsManager({
    activeTabId: properties,
    tabList: new Map([[properties, { name: properties }]]),
  })
  const { dispatch } = useDisplay()

  const tooltipId = useId()

  const handleCloneBtnClick = () => {
    if (!disabled) {
      trigger('AssistantModal', { action: 'clone', bot: bot })
      return
    }

    trigger('SignInModal', {})
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

  const dispatchTrigger = (isOpen: boolean) =>
    dispatch({
      type: 'set',
      option: {
        id: consts.ACTIVE_ASSISTANT_SP_ID,
        value: isOpen ? bot.name : null,
      },
    })

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])
  const onModeration = bot?.publish_state === 'in_progress'
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
              onClick={() => tabsInfo.handleTabSelect(id)}
            >
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
            {bot?.author?.fullname == 'Deepy Pavlova' ? (
              <img src={Woman} alt='Author' />
            ) : (
              <img src={bot?.author?.picture} />
            )}
            <span>
              {bot?.author?.fullname! == 'Deepy Pavlova'
                ? 'Dr. Xandra Smith'
                : bot?.author?.fullname!}
              {/* {bot?.author.fullname} */}
            </span>
          </div>
          <span className={s.separator} />
          <div className={s.dateAndVersion}>
            <div className={s.date}>
              <CalendarIcon />
              {dateToUTC(bot?.date_created)}
            </div>
            {type == 'your' && (
              <SmallTag
                theme={
                  bot?.publish_state === 'in_progress'
                    ? 'validating'
                    : bot?.visibility
                }
              >
                {!bot?.publish_state
                  ? type === 'your' && bot?.visibility
                  : bot?.publish_state == 'in_progress'
                  ? 'On moderation'
                  : bot?.visibility === 'public_template'
                  ? 'Public'
                  : bot?.visibility}
              </SmallTag>
            )}
          </div>
        </div>
        <div className={s.scroll}>
          <div className={s.container}>
            <p className={s.desc}>{bot?.description}</p>
            {/* <div className={s.accordions}>
              <Loader isLoading={isComponentsLoading} />
              {components &&
                Object.keys(components).map((group: string, id: number) => (
                  <Accordion
                    key={id}
                    title={capitalizeTitle(group)}
                    group={group as StackType}
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
            </div> */}
          </div>
        </div>
        <div className={s.btns}>
          {type === 'public' && (
            <>
              <Button
                theme='secondary'
                props={{ 'data-tooltip-id': tooltipId }}
              >
                More
              </Button>
              <BotCardToolTip
                tooltipId={tooltipId}
                bot={bot}
                type={type}
                inSidePanel
              />
              <Button theme='primary' props={{ onClick: handleCloneBtnClick }}>
                Use
              </Button>
            </>
          )}
          {type === 'your' && (
            <>
              <Button
                props={{ 'data-tooltip-id': tooltipId }}
                theme='secondary'
              >
                More
              </Button>
              <Button
                props={{ onClick: handlEditClick, disabled: onModeration }}
                theme='primary'
              >
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
