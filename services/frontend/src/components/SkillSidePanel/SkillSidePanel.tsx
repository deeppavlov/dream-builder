import { useComponent } from '../../hooks/useComponent'
import { TabList } from '../../hooks/useTabsManager'
import DumbSkillSP from './DumbSkillSP'

interface Props {
  component_id: number
  distName: string
  activeTab?: 'Properties' | 'Editor'
  tabs?: TabList
  children?: React.ReactNode // Editor Tab element
}

const SkillSidePanel = ({
  component_id,
  distName,
  activeTab,
  tabs,
  children,
}: Props) => {
  const { getComponent } = useComponent()
  const { data: skill } = getComponent({
    id: component_id,
    distName,
    type: 'skills',
  })
  return (
    <DumbSkillSP
      skill={skill}
      activeTab={activeTab}
      tabs={tabs}
      children={children}
    />
  )
}

export default SkillSidePanel
