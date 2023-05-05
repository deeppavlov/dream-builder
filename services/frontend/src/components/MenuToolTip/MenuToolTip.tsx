import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { usePreview } from '../../context/PreviewProvider'
import { mockSkills } from '../../mocks/database/mockSkills'
import { RoutesList } from '../../router/RoutesList'
import { BotInfoInterface, TTopbar } from '../../types/types'
import { trigger } from '../../utils/events'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

interface Props {
  tooltipId: string
  type: TTopbar
  bot: BotInfoInterface
}

const MenuToolTip = ({ tooltipId, type, bot }: Props) => {
  const { isPreview } = usePreview()
  const navigate = useNavigate()
  const { name: distName } = useParams()
  const queryState = useQueryClient().getQueryState(['dist', distName])
  const dist = queryState?.data as BotInfoInterface | undefined

  const handleWelcomeClick = () => {
    navigate(RoutesList.profile)
  }
  const handleRenameClick = () => {
    trigger('AssistantModal', { action: 'edit', bot, from: 'editor' })
  }
  const handleAddSkillsClick = () => {
    trigger('SkillsListModal', { mockSkills })
  }
  const handlePublishClick = () => {
    trigger('PublishAssistantModal', { bot, from: 'editor' })
  }
  const handleDeleteClick = () => {
    trigger('DeleteAssistantModal', { bot, from: 'editor' })
  }
  const handleShareClick = () => trigger('ShareModal', distName)

  return (
    <BaseContextMenu tooltipId={tooltipId} place='bottom'>
      <ContextMenuButton
        type='about'
        linkTo='http://deepdream.builders'
        name='About'
      />
      {type === 'editor' && (
        <>
          <ContextMenuButton
            name='Welcome guide'
            type='properties'
            handleClick={handleWelcomeClick}
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name='Rename'
            type='edit'
            handleClick={handleRenameClick}
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name='Add Skills'
            type='add'
            handleClick={handleAddSkillsClick}
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name='Visibility'
            type='publish'
            handleClick={handlePublishClick}
          />
          <ContextMenuButton
            name='Share'
            type='share'
            disabled={dist?.visibility === 'private' || isPreview}
            handleClick={handleShareClick}
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name='Delete'
            type='delete'
            handleClick={handleDeleteClick}
          />
        </>
      )}
    </BaseContextMenu>
  )
}

export default MenuToolTip
