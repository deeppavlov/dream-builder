import { IStackElement } from 'types/types'
import { trigger } from 'utils/events'
import { ContextMenuButton } from 'components/Buttons'
import { BaseContextMenu } from 'components/Menus'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import SelectorSettingsSidePanel from 'components/Unused/SelectorSettingsSidePanel/SelectorSettingsSidePanel'

interface Props {
  tooltipId: string
  skill: IStackElement
}

const SkillSelectorStackToolTip = ({ tooltipId, skill }: Props) => {
  const handlePropertiesBtnClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      children: <SelectorSettingsSidePanel skill={skill} />,
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
