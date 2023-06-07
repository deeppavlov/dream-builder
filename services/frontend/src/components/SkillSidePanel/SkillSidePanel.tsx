import { useEffect } from 'react'
import { useComponent } from '../../hooks/useComponent'
import { TabList } from '../../hooks/useTabsManager'
import { SkillAvailabilityType } from '../../types/types'
import { trigger } from '../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import DumbSkillSP from './DumbSkillSP'

interface Props {
  component_id: number
  distName: string
  activeTab?: 'Properties' | 'Editor'
  tabs?: TabList
  visibility?: SkillAvailabilityType
  children?: React.ReactNode // Editor Tab element
}

const SkillSidePanel = ({
  component_id,
  distName,
  activeTab,
  tabs,
  visibility,
  children,
}: Props) => {
  const { getComponent } = useComponent()
  const { data: skill } = getComponent({
    id: component_id,
    distName,
    type: 'skills',
  })

  // Close SidePanel if the skill was deleted
  useEffect(() => {
    if (!skill) trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }, [skill])

  return (
    <DumbSkillSP
      skill={skill}
      activeTab={activeTab}
      tabs={tabs}
      visibility={visibility}
      children={children}
    />
  )
}

export default SkillSidePanel
