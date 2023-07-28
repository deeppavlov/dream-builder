import { useAuth } from 'context'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { BotAvailabilityType, BotInfoInterface } from 'types/types'
import { PUBLISH_REQUEST_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { trigger } from 'utils/events'
import { ContextMenuButton } from 'components/Buttons'
import BaseContextMenu from 'components/Menus/BaseContextMenu/BaseContextMenu'
import { AssistantDialogSidePanel, AssistantSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'

interface Props {
  tooltipId: string
  bot: BotInfoInterface
  type: BotAvailabilityType
  isDeployed: boolean
  inSidePanel?: boolean
}

const AssistantContextMenu: FC<Props> = ({
  tooltipId,
  bot,
  type,
  inSidePanel,
  isDeployed,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'ctx_menus.assistant',
  })
  const auth = useAuth()
  const navigate = useNavigate()
  const { name } = useParams()
  const isEditor = name !== undefined && name !== null && name?.length > 0
  const { vaPropsOpened, setVaArchitectureOptions, renameVaButtonClick } =
    useGaAssistant()

  const handlePropertiesBtnClick = () => {
    vaPropsOpened('va_card_context_menu', bot)

    trigger(TRIGGER_RIGHT_SP_EVENT, {
      children: (
        <AssistantSidePanel
          key={bot.id}
          name={bot.name}
          disabled={!auth?.user}
          type={type}
        />
      ),
    })
  }

  const handleRenameBtnClick = () => {
    const source = inSidePanel ? 'va_sidepanel' : 'va_block'
    renameVaButtonClick(source, bot)

    const isPublicTemplate =
      bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

    if (isPublicTemplate)
      return trigger('PublicToPrivateModal', { bot, action: 'rename' })

    trigger('AssistantModal', { action: 'edit', bot })
  }

  const handlePublishBtnClick = () => trigger('PublishAssistantModal', { bot })

  const handleShareBtnClick = () => trigger('ShareAssistantModal', { bot })

  const handleDeleteBtnClick = () => trigger('DeleteAssistantModal', { bot })

  const handleChatClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      children: (
        <AssistantDialogSidePanel
          key={bot?.name + 'chat_with_assistant'}
          dist={bot}
        />
      ),
    })

  const handleCheckArchitectureClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const source = inSidePanel ? 'va_template_sidepanel' : 'va_templates_block'
    setVaArchitectureOptions(source)

    navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }), {
      state: {
        preview: true,
        distName: bot?.name,
        displayName: bot?.display_name,
      },
    })

    e.stopPropagation()
  }

  return (
    <BaseContextMenu tooltipId={tooltipId} place='right'>
      {type == 'your' && (
        <>
          <ContextMenuButton
            name={t('chat')}
            type='chat'
            handleClick={handleChatClick}
          />
          <ContextMenuButton
            disabled={
              bot?.visibility === VISIBILITY_STATUS.PRIVATE || !isDeployed
            }
            name={t('share')}
            type='share'
            handleClick={handleShareBtnClick}
          />
          <ContextMenuButton
            name={t('visibility')}
            type='publish'
            handleClick={handlePublishBtnClick}
          />
          <hr />
          <ContextMenuButton
            disabled={bot?.publish_state == PUBLISH_REQUEST_STATUS.IN_REVIEW}
            name={t('rename')}
            type='edit'
            handleClick={handleRenameBtnClick}
          />
          {!inSidePanel &&
            !isEditor && ( //FIX!!
              <ContextMenuButton
                name={t('properties')}
                type='properties'
                handleClick={handlePropertiesBtnClick}
              />
            )}
          <hr />
          <ContextMenuButton
            name={t('delete')}
            type='delete'
            handleClick={handleDeleteBtnClick}
          />
        </>
      )}
      {type == 'public' && (
        <>
          <ContextMenuButton
            name={t('chat')}
            type='chat'
            handleClick={handleChatClick}
          />
          {!inSidePanel && (
            <>
              <hr />
              <ContextMenuButton
                name={t('properties')}
                type='properties'
                handleClick={handlePropertiesBtnClick}
              />
              <hr />
            </>
          )}
          <ContextMenuButton
            name={t('check_skills')}
            type='architecture'
            handleClick={handleCheckArchitectureClick}
          />
        </>
      )}
    </BaseContextMenu>
  )
}

export default AssistantContextMenu
