import { mockSkills } from 'mocks/database/mockSkills'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { BotInfoInterface, TTopbar } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { trigger } from 'utils/events'
import { ContextMenuButton } from 'components/Buttons'
import { BaseContextMenu } from 'components/Menus'

interface Props {
  tooltipId: string
  type: TTopbar
  bot: BotInfoInterface
}

const MenuToolTip = ({ tooltipId, type, bot }: Props) => {
  const { isPreview } = usePreview()
  const { name: distName } = useParams()
  const queryState = useQueryClient().getQueryState(['dist', distName])
  const dist = queryState?.data as BotInfoInterface | undefined

  const handleWelcomeClick = () => {}
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
  const handleShareClick = () => trigger('ShareAssistantModal', distName)

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
            name='Feedback'
            linkTo='https://forum.deeppavlov.ai/c/dream-builder/57'
            type='architecture'
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
            disabled={
              dist?.visibility === VISIBILITY_STATUS.PRIVATE || isPreview
            }
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
