import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import { useEffect, useId } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Woman from '../../assets/icons/woman.png'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import useTabsManager from '../../hooks/useTabsManager'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import EditPencilButton from '../EditPencilButton/EditPencilButton'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './DumbAssitantSP.module.scss'

interface Props {
  bot: BotInfoInterface
  disabled?: boolean
  type: BotAvailabilityType
}

const DumbAssistantSP = ({ bot, disabled, type }: Props) => {
  const [properties] = ['Properties']
  const navigate = useNavigate()
  const [tabsInfo] = useTabsManager({
    activeTabId: properties,
    tabList: new Map([[properties, { name: properties }]]),
  })
  const { isPreview } = usePreview()
  const { name: distName } = useParams()
  const { dispatch } = useDisplay()
  const onModeration = bot?.publish_state === 'in_progress'
  const isPreviewEditor = distName && distName?.length > 0 && isPreview
  const isPublic = bot?.visibility === 'public_template'
  const isCustomizable = !isPublic && !isPreviewEditor && !onModeration
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

  const handleRenameBtnClick = () => {
    trigger('AssistantModal', { bot, action: 'edit' })
  }

  const dispatchTrigger = (isOpen: boolean) => {
    dispatch({
      type: 'set',
      option: {
        id: consts.ACTIVE_ASSISTANT_SP_ID,
        value: isOpen ? `info_${bot?.id}` : null,
      },
    })
  }

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  return (
    bot && (
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
            {!isPublic && (
              <EditPencilButton
                disabled={isCustomizable}
                onClick={handleRenameBtnClick}
              />
            )}
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
                  ? 'On Moderation'
                  : bot?.visibility === 'public_template'
                  ? 'Public Template'
                  : bot?.visibility}
              </SmallTag>
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
                <Button
                  theme='primary'
                  props={{ onClick: handleCloneBtnClick }}
                >
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
  )
}

export default DumbAssistantSP
