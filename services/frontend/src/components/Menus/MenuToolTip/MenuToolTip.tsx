import { mockSkills } from 'mocks/database/mockSkills'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { BotInfoInterface, TTopbar } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { useAssistants } from 'hooks/api'
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
  const { t } = useTranslation('translation', {
    keyPrefix: 'topbar.ctx_menus',
  })
  const { getDist } = useAssistants()
  const dist = getDist({ distName })?.data
  const isPrivate = dist?.visibility === VISIBILITY_STATUS.PRIVATE

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
        name={t('main_burger.about')}
      />
      {type === 'editor' && (
        <>
          <ContextMenuButton
            name={t('assistant_burger.welcome_guide')}
            type='properties'
            linkTo='https://builder.deeppavlov.ai/ '
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name={t('assistant_burger.rename')}
            type='edit'
            handleClick={handleRenameClick}
          />
          <hr />
          <ContextMenuButton
            name={t('assistant_burger.feedback')}
            linkTo='https://forum.deeppavlov.ai/c/dream-builder/57'
            type='architecture'
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name={t('assistant_burger.add_skills')}
            type='add'
            handleClick={handleAddSkillsClick}
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name={t('assistant_burger.visibility')}
            type='publish'
            handleClick={handlePublishClick}
          />
          <ContextMenuButton
            name={t('assistant_burger.share')}
            type='share'
            disabled={isPrivate || isPreview}
            handleClick={handleShareClick}
          />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name={t('assistant_burger.delete')}
            type='delete'
            handleClick={handleDeleteClick}
          />
        </>
      )}
    </BaseContextMenu>
  )
}

export default MenuToolTip
