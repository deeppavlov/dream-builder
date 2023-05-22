import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import { useEffect, useId } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import DB from '../../assets/icons/logo.png'
import {
  PublishRequestsStatus,
  VisibilityStatus,
} from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import useTabsManager from '../../hooks/useTabsManager'
import { RoutesList } from '../../router/RoutesList'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import AssistantContextMenu from '../AssistantContextMenu/AssistantContextMenu'
import EditPencilButton from '../EditPencilButton/EditPencilButton'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './DumbAssitantSP.module.scss'
import { getAssistantState } from '../../utils/getAssistantState'

interface Props {
  bot: BotInfoInterface
  disabled?: boolean
  type: BotAvailabilityType
  fromEditor?: boolean
}

const DumbAssistantSP = ({ bot, disabled, type, fromEditor }: Props) => {
  const [properties] = ['Properties']
  const navigate = useNavigate()
  const [tabsInfo] = useTabsManager({
    activeTabId: properties,
    tabList: new Map([[properties, { name: properties }]]),
  })
  const { isPreview } = usePreview()
  const { name: distName } = useParams()
  const { dispatch } = useDisplay()
  const isPreviewEditor = distName && distName?.length > 0 && isPreview
  const isPublic = bot?.visibility === VisibilityStatus.PUBLIC_TEMPLATE
  const tooltipId = useId()
  const { onModeration, isDeployed, isDeploying } = getAssistantState(bot)
  const isPublished = bot?.visibility === VisibilityStatus.PUBLIC_TEMPLATE

  const isDeepyPavlova = bot?.author?.fullname! == 'Deepy Pavlova'
  const author = isDeepyPavlova ? 'Dream Builder Team' : bot?.author?.fullname!

  const isCustomizable = !isPublic && !isPreviewEditor && !onModeration
  const { name } = useParams()
  const isEditor = Boolean(name)
  const handleCloneBtnClick = () => {
    const assistantClone = { action: 'clone', bot: bot }

    if (!disabled) return trigger('AssistantModal', assistantClone)

    trigger('SignInModal', {
      requestModal: { name: 'AssistantModal', options: assistantClone },
    })
  }

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    isPublished
      ? trigger('PublicToPrivateModal', { bot, action: 'edit' })
      : navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }), {
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
  const privateAssistant = bot?.visibility === VisibilityStatus.PRIVATE
  const unlistedAssistant = bot?.visibility === VisibilityStatus.UNLISTED_LINK
  const publishState = onModeration
    ? 'On Moderation'
    : isPublished
    ? 'Public Template'
    : unlistedAssistant
    ? 'Unlisted'
    : privateAssistant
    ? 'Private'
    : null

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
                disabled={!isCustomizable || isDeploying}
                onClick={handleRenameBtnClick}
              />
            )}
          </div>
          <div className={s.topContainer}>
            <div className={s.author}>
              {isDeepyPavlova ? (
                <img src={DB} alt='Author' />
              ) : (
                <img src={bot?.author?.picture} />
              )}
              <span>{author}</span>
            </div>
            <span className={s.separator} />
            <div className={s.dateAndVersion}>
              <div className={s.date}>
                <CalendarIcon />
                {dateToUTC(bot?.date_created)}
              </div>
              <SmallTag
                theme={
                  bot?.publish_state === PublishRequestsStatus.IN_REVIEW
                    ? 'validating'
                    : bot?.visibility
                }
              >
                {publishState}
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
                <AssistantContextMenu
                  tooltipId={tooltipId}
                  bot={bot}
                  type={type}
                  isDeployed={isDeployed}
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
                {!isEditor && (
                  <Button
                    props={{
                      onClick: handlEditClick,
                      disabled: onModeration || isDeploying,
                    }}
                    theme='primary'
                  >
                    Edit
                  </Button>
                )}
                <AssistantContextMenu
                  tooltipId={tooltipId}
                  bot={bot}
                  type={type}
                  isDeployed={isDeployed}
                />
              </>
            )}
          </div>
        </div>
      </>
    )
  )
}

export default DumbAssistantSP
