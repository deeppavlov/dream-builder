import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ISkill } from 'types/types'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { trigger } from 'utils/events'
import triggerSkillSidePanel from 'utils/triggerSkillSidePanel'
import { ContextMenuButton } from 'components/Buttons'
import { BaseContextMenu } from 'components/Menus'

interface Props {
  tooltipId: string
  skill: ISkill
  isPreview?: boolean
}

const SkillCardToolTip: FC<Props> = ({ tooltipId, skill, isPreview }) => {
  const { name } = useParams()
  const { t } = useTranslation('translation', { keyPrefix: 'ctx_menus.skill' })
  const { skillsPropsOpened } = useGaSkills()
  // const handleEditBtnClick = () => {
  //   if (skill.component_type === 'Generative') {
  //     trigger('SkillPromptModal', { skill })
  //     return
  //   }

  //   triggerSkillSidePanel({ skill, activeTab: 'details' })
  // }

  const handlePropertiesBtnClick = () => {
    skillsPropsOpened('skill_block_context_menu', skill)
    triggerSkillSidePanel({
      skill,
      activeTab: 'properties',
      distName: name || '',
    })
  }

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
          name={t('rename')}
          type='edit'
          disabled={isPreview}
          handleClick={handleRenameBtnClick}
        />
      )}
      <ContextMenuButton
        name={t('properties')}
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
        name={t('delete')}
        type='delete'
        disabled={isPreview || skill?.component_type !== ('Generative' as any)}
        handleClick={handleDeleteBtnClick}
      />
    </BaseContextMenu>
  )
}

export default SkillCardToolTip
