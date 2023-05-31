import { useUIOptions } from 'context'
import { useEffect, useId } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg'
import DB from 'assets/icons/logo.png'
import { RoutesList } from 'router/RoutesList'
import { BotAvailabilityType, BotInfoInterface } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { PUBLISH_REQUEST_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import useTabsManager from 'hooks/useTabsManager'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import { trigger } from 'utils/events'
import { getAssistantState } from 'utils/getAssistantState'
import { Button, EditPencilButton } from 'components/Buttons'
import { AssistantContextMenu } from 'components/Menus'
import { SidePanelHeader } from 'components/Panels'
import { SmallTag } from 'components/UI'
import s from './DumbAssitantSP.module.scss'

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
  const { setUIOption } = useUIOptions()
  const isPreviewEditor = distName && distName?.length > 0 && isPreview
  const isPublic = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
  const tooltipId = useId()
  const { onModeration, isDeployed, isDeploying } = getAssistantState(bot)
  const isPublished = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

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
      : navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }))

    e.stopPropagation()
  }

  const handleRenameBtnClick = () => {
    trigger('AssistantModal', { bot, action: 'edit' })
  }

  const dispatchTrigger = (isOpen: boolean) => {
    setUIOption({
      name: consts.ACTIVE_ASSISTANT_SP_ID,
      value: isOpen ? `info_${bot?.id}` : null,
    })
  }

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])
  const privateAssistant = bot?.visibility === VISIBILITY_STATUS.PRIVATE
  const unlistedAssistant = bot?.visibility === VISIBILITY_STATUS.UNLISTED_LINK
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
                disabled={!isCustomizable}
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
                  bot?.publish_state === PUBLISH_REQUEST_STATUS.IN_REVIEW
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
