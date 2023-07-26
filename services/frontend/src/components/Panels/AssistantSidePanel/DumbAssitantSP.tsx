import { useUIOptions } from 'context'
import { useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg'
import DB from 'assets/icons/logo.png'
import { RoutesList } from 'router/RoutesList'
import { BotAvailabilityType, BotInfoInterface, TLocale } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { PUBLISH_REQUEST_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { useGA } from 'hooks/useGA'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import { trigger } from 'utils/events'
import { getAssistantState } from 'utils/getAssistantState'
import { Button, EditPencilButton } from 'components/Buttons'
import { Accordion } from 'components/Dropdowns'
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
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isPreview } = usePreview()
  const { name: distName } = useParams()
  const { setUIOption } = useUIOptions()
  const { createVaFromTemplateButtonClick } = useGA()
  const isPreviewEditor = distName && distName?.length > 0 && isPreview
  const isPublic = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
  const tooltipId = useId()
  const { onModeration, isDeployed, isDeploying } = getAssistantState(bot)
  const isPublished = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

  const isDeepyPavlova = bot?.author?.fullname! == 'Deepy Pavlova'
  const author = isDeepyPavlova
    ? 'Dream Builder Team'
    : bot?.author?.fullname
    ? bot?.author?.fullname
    : bot?.author?.given_name + ' ' + bot?.author?.family_name

  const isCustomizable = !isPublic && !isPreviewEditor && !onModeration
  const { name } = useParams()
  const isEditor = Boolean(name)
  const handleCloneBtnClick = () => {
    createVaFromTemplateButtonClick('va_template_sidepanel', 'none', {
      id: bot.id,
      name: bot.display_name,
      authorId: bot.author.id,
      authorName: bot.author.fullname || 'none',
    })

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
    ? t('assistant_visibility.on_moderation')
    : isPublished
    ? t('assistant_visibility.public_template')
    : unlistedAssistant
    ? t('assistant_visibility.unlisted')
    : privateAssistant
    ? t('assistant_visibility.private')
    : null

  return (
    bot && (
      <>
        <SidePanelHeader>
          <ul role='tablist'>
            <li role='tab' aria-selected>
              {t('tabs.properties')}
            </li>
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
                {dateToUTC(bot?.date_created, i18n.language as TLocale)}
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
              <Accordion title={t('accordions.desc')} rounded isActive>
                <p className={s.desc}>{bot?.description}</p>
              </Accordion>
            </div>
          </div>
          <div className={s.btns}>
            {type === 'public' && (
              <>
                <Button
                  theme='secondary'
                  props={{ 'data-tooltip-id': tooltipId }}
                >
                  {t('sidepanels.assistant.btns.more')}
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
                  {t('sidepanels.assistant.btns.use')}
                </Button>
              </>
            )}
            {type === 'your' && (
              <>
                <Button
                  props={{ 'data-tooltip-id': tooltipId }}
                  theme='secondary'
                >
                  {t('sidepanels.assistant.btns.more')}
                </Button>
                {!isEditor && (
                  <Button
                    props={{
                      onClick: handlEditClick,
                      disabled: onModeration || isDeploying,
                    }}
                    theme='primary'
                  >
                    {t('sidepanels.assistant.btns.edit')}
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
