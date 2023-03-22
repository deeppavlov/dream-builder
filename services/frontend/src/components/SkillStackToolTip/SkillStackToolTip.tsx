import { IContextMenu, IStackElement } from '../../types/types'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

interface Props extends IContextMenu {
  tooltipId: string
  skill: IStackElement
}

const SkillStackToolTip = ({ tooltipId, skill, isPreview }: Props) => {
  const handleEditBtnClick = () =>
    triggerSkillSidePanel({ skill, activeTab: 'Editor' })

  const handlePropertiesBtnClick = () =>
    triggerSkillSidePanel({ skill, activeTab: 'Properties' })

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

export default SkillStackToolTip
