import { FC } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import {
  PublishRequestsStatus,
  VisibilityStatus,
} from '../../constants/constants'
import { useAuth } from '../../context/AuthProvider'
import { RoutesList } from '../../router/RoutesList'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { AssistantDialogSidePanel } from '../AssistantDialogSidePanel/AssistantDialogSidePanel'
import AssistantSidePanel from '../AssistantSidePanel/AssistantSidePanel'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

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
  const auth = useAuth()
  const navigate = useNavigate()
  const { name } = useParams()
  const isEditor = name !== undefined && name !== null && name?.length > 0

  const handlePropertiesBtnClick = () =>
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

  const handleRenameBtnClick = () => {
    const isPublicTemplate =
      bot?.visibility === VisibilityStatus.PUBLIC_TEMPLATE

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
            name='Chat With Assistant'
            type='chat'
            handleClick={handleChatClick}
          />
          <ContextMenuButton
            disabled={
              bot?.visibility === VisibilityStatus.PRIVATE || !isDeployed
            }
            name='Share'
            type='share'
            handleClick={handleShareBtnClick}
          />
          <ContextMenuButton
            name='Visibility'
            type='publish'
            handleClick={handlePublishBtnClick}
          />
          <hr />
          <ContextMenuButton
            disabled={bot?.publish_state == PublishRequestsStatus.IN_REVIEW}
            name='Rename'
            type='edit'
            handleClick={handleRenameBtnClick}
          />
          {!inSidePanel &&
            !isEditor && ( //FIX!!
              <ContextMenuButton
                name='Properties'
                type='properties'
                handleClick={handlePropertiesBtnClick}
              />
            )}
          <hr />
          <ContextMenuButton
            name='Delete'
            type='delete'
            handleClick={handleDeleteBtnClick}
          />
        </>
      )}
      {type == 'public' && (
        <>
          <ContextMenuButton
            name='Chat With Assistant'
            type='chat'
            handleClick={handleChatClick}
          />
          {!inSidePanel && (
            <>
              <hr />
              <ContextMenuButton
                name='Properties'
                type='properties'
                handleClick={handlePropertiesBtnClick}
              />
              <hr />
            </>
          )}
          <ContextMenuButton
            name='Check Skills'
            type='architecture'
            handleClick={handleCheckArchitectureClick}
          />
        </>
      )}
    </BaseContextMenu>
  )
}

export default AssistantContextMenu
