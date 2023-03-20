import { ISkill } from '../../types/types'
import { trigger } from '../../utils/events'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

interface Props {
  tooltipId: string
  skill: ISkill
  isPreview?: boolean
}

const SkillCardToolTip = ({ tooltipId, skill, isPreview }: Props) => {
  const handleEditBtnClick = () => {
    trigger('SkillPromptModal', { skill, action: 'edit' })
  }
  // triggerSkillSidePanel({ skill, activeTab: 'Editor' })

  const handlePropertiesBtnClick = () =>
    triggerSkillSidePanel({ skill, activeTab: 'Properties' })

  const handleDisableBtnClick = () => {}

  const handleDeleteBtnClick = () => {}

  return (
    <BaseContextMenu tooltipId={tooltipId}>
      {skill.is_customizable && (
        <ContextMenuButton
          name='Edit Skill'
          type='edit'
          disabled={isPreview}
          handleClick={handleEditBtnClick}
        />
      )}
      <ContextMenuButton
        name='Properties'
        type='properties'
        handleClick={handlePropertiesBtnClick}
      />
      <ContextMenuButton
        name='Disable Skill'
        type='disable'
        disabled={isPreview}
      />
      <hr />
      <ContextMenuButton
        name='Delete'
        type='delete'
        disabled={isPreview}
        handleClick={handleDeleteBtnClick}
      />
    </BaseContextMenu>
  )
}

export default SkillCardToolTip
