import { IContextMenu, Skill } from '../../types/types'
import { trigger } from '../../utils/events'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'
import SelectorSettingsSidePanel from '../SelectorSettingsSidePanel/SelectorSettingsSidePanel'

interface Props extends IContextMenu {
  tooltipId: string
  skill: Skill
}

const SkillSelectorStackToolTip = ({
  tooltipId,
  skill,
  isCustomizable,
  isPreview,
}: Props) => {
  const handlePropertiesBtnClick = () =>
    trigger(BASE_SP_EVENT, {
      children: (
        <SelectorSettingsSidePanel
          name={skill.display_name}
          desc={skill.description}
        />
      ),
    })

  return (
    <BaseContextMenu tooltipId={tooltipId}>
      <ContextMenuButton
        name='Properties'
        type='properties'
        handleClick={handlePropertiesBtnClick}
      />
    </BaseContextMenu>
  )
}

export default SkillSelectorStackToolTip
