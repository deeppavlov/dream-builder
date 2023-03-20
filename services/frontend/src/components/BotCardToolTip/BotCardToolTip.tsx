import { useAuth } from '../../Context/AuthProvider'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

interface Props {
  tooltipId: string
  bot: BotInfoInterface
  type: BotAvailabilityType
}

const BotCardToolTip = ({ tooltipId, bot, type }: Props) => {
  const auth = useAuth()

  const handlePropertiesBtnClick = () =>
    trigger(BASE_SP_EVENT, {
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
    trigger('AssistantModal', { action: 'edit', bot })

  const handlePublishBtnClick = () => trigger('PublishAssistantModal', { bot })

  const handleShareBtnClick = () =>
    trigger('ShareModal', { bot, smthElse: '1234' })

  const handleDeleteBtnClick = () => trigger('DeleteAssistantModal', { bot })

  return (
    <BaseContextMenu tooltipId={tooltipId} place='bottom'>
      <ContextMenuButton
        name='Publish'
        type='publish'
        disabled={type === 'public'}
        handleClick={handlePublishBtnClick}
      />
      <ContextMenuButton
        name='Share'
        type='share'
        disabled={type === 'public'}
        handleClick={handleShareBtnClick}
      />
      <hr />
      <ContextMenuButton
        name='Rename'
        type='edit'
        disabled={type === 'public'}
        handleClick={handleRenameBtnClick}
      />
      <ContextMenuButton
        name='Properties'
        type='properties'
        handleClick={handlePropertiesBtnClick}
      />
      <hr />
      <ContextMenuButton
        name='Delete'
        type='delete'
        disabled={type === 'public'}
        handleClick={handleDeleteBtnClick}
      />
    </BaseContextMenu>
  )
}

export default BotCardToolTip
