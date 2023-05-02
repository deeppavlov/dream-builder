import { FC } from 'react'
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

const SkillCardToolTip: FC<Props> = ({ tooltipId, skill, isPreview }) => {
  // const handleEditBtnClick = () => {
  //   if (skill.component_type === 'Generative') {
  //     trigger('SkillPromptModal', { skill })
  //     return
  //   }

  //   triggerSkillSidePanel({ skill, activeTab: 'Editor' })
  // }

  const handlePropertiesBtnClick = () =>
    triggerSkillSidePanel({ skill, activeTab: 'Properties' })

  const handleRenameBtnClick = () => {
    trigger('SkillModal', { action: 'edit', skill })
  }

  const handleDeleteBtnClick = () => {
    trigger('DeleteSkillModal', { skill })
  }

  // const handleDisableBtnClick = () => {}

  return (
    <BaseContextMenu tooltipId={tooltipId}>
      {/* {skill.is_customizable && (
        <ContextMenuButton
          name='Edit Skill'
          type='edit'
          disabled={isPreview}
          handleClick={handleEditBtnClick}
        />
      )} */}
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
        disabled={isPreview || skill?.component_type !== ('Generative' as any)}
        handleClick={handleDeleteBtnClick}
      />
    </BaseContextMenu>
  )
}

export default SkillCardToolTip
