import React from 'react'
import { IContextMenu, ISkill } from '../../types/types'
import { trigger } from '../../utils/events'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

interface Props extends IContextMenu {
  tooltipId: string
  skill: ISkill
  skillRef?: React.MutableRefObject<any>
  deleteFunc: () => void
}

const SkillStackToolTip = ({
  tooltipId,
  skill,
  isPreview,
  skillRef,
}: Props) => {
  const handleEditBtnClick = () =>
    triggerSkillSidePanel({ skill, activeTab: 'Editor', parent: skillRef })

  const handlePropertiesBtnClick = () =>
    triggerSkillSidePanel({ skill, activeTab: 'Properties', parent: skillRef })

  const handleDeleteBtnClick = () => {
    trigger('DeleteSkillModal', { skill })
  }
  const handleRenameBtnClick = () => {
    trigger('SkillModal', { action: 'edit', skill })
  }
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
      {skill.is_customizable && (
        <ContextMenuButton
          name='Rename'
          type='edit'
          disabled={isPreview}
          handleClick={handleRenameBtnClick}
        />
      )}
      <ContextMenuButton
        name='Properties'
        type='properties'
        handleClick={handlePropertiesBtnClick}
      />
      {/* <ContextMenuButton
        name='Disable Skill'
        type='disable'
        disabled={isPreview}
      /> */}
      <hr />
      <ContextMenuButton
        name='Delete'
        type='delete'
        disabled={isPreview || skill?.component_type !== 'Generative'}
        handleClick={handleDeleteBtnClick}
      />
    </BaseContextMenu>
  )
}

export default SkillStackToolTip
