import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'
import DialogSidePanel from '../DialogSidePanel/DialogSidePanel'

interface Props {
  tooltipId: string
  bot: BotInfoInterface
  type: BotAvailabilityType
  inSidePanel?: boolean
}

const BotCardToolTip: FC<Props> = ({ tooltipId, bot, type, inSidePanel }) => {
  const auth = useAuth()
  const navigate = useNavigate()

  const handlePropertiesBtnClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      children: (
        <BotInfoSidePanel
          key={bot.name}
          bot={bot}
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
    trigger(TRIGGER_RIGHT_SP_EVENT, {bot,
      children: (
        <DialogSidePanel
          debug={false}
          key={bot?.name + 'chat_with_assistant'}
          chatWith='bot'
          start
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
            name='Chat With Bot'
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
            disabled={bot?.publish_state == 'in_progress'}
            name='Rename'
            type='edit'
            handleClick={handleRenameBtnClick}
          />
          <hr />
          <ContextMenuButton
            // disabled={bot?.publish_state === 'in_progress'}
            name='Visibility'
            type='publish'
            handleClick={handlePublishBtnClick}
          />
          {!inSidePanel && (
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
            name='Chat With Bot'
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
