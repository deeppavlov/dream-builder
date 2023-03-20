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
      {type === 'your' && (
        <ContextMenuButton
          name='Rename'
          type='edit'
          handleClick={handleRenameBtnClick}
        />
      )}
      <ContextMenuButton
        name='Properties'
        type='properties'
        handleClick={handlePropertiesBtnClick}
      />
      {type === 'your' && (
        <>
          <ContextMenuButton
            name='Publish'
            type='publish'
            handleClick={handlePublishBtnClick}
          />
          <ContextMenuButton
            name='Share'
            type='download'
            handleClick={handleShareBtnClick}
          />
          <hr />
          <ContextMenuButton
            name='Delete'
            type='delete'
            handleClick={handleDeleteBtnClick}
          />
        </>
      )}
    </BaseContextMenu>
  )
}

export default BotCardToolTip
