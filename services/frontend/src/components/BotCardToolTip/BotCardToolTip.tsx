import { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
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
  inSidePanel?: boolean
}

const BotCardToolTip: FC<Props> = ({ tooltipId, bot, type, inSidePanel }) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const { name } = useParams()
  const isEditor = Boolean(name)
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

  const handleRenameBtnClick = () =>
    bot?.visibility === 'public_template'
      ? trigger('PublicToPrivateModal', { bot, action: 'rename' })
      : trigger('AssistantModal', { action: 'edit', bot })

  const handlePublishBtnClick = () => trigger('PublishAssistantModal', { bot })

  const handleShareBtnClick = () => trigger('ShareModal', { bot })

  const handleDeleteBtnClick = () => trigger('DeleteAssistantModal', { bot })

  const handleChatClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      children: (
        <AssistantDialogSidePanel
          debug={false}
          key={bot?.name + 'chat_with_assistant'}
          chatWith='bot'
          // start
          dist={bot}
        />
      ),
    })
  }
  const handleCheckArchitectureClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    navigate(`/${bot?.name}`, {
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
            disabled={bot?.visibility == 'private'}
            name='Share'
            type='share'
            handleClick={handleShareBtnClick}
          />
          <ContextMenuButton
            // disabled={bot?.publish_state === 'in_progress'}
            name='Visibility'
            type='publish'
            handleClick={handlePublishBtnClick}
          />
          <hr />
          <ContextMenuButton
            disabled={bot?.publish_state == 'in_progress'}
            name='Rename'
            type='edit'
            handleClick={handleRenameBtnClick}
          />
          {!inSidePanel && !isEditor && ( //FIX!!
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

export default BotCardToolTip
