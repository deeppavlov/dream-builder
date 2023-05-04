import { TRIGGER_RIGHT_SP_EVENT } from '../components/BaseSidePanel/BaseSidePanel'
import GenerativeSkillEditor from '../components/GenerativeSkillEditor/GenerativeSkillEditor'
import IntentResponderSidePanel from '../components/IntentResponderSidePanel/IntentResponderSidePanel'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'
import { ISkill, SkillAvailabilityType } from '../types/types'
import { trigger } from './events'

interface Props {
  skill: ISkill
  distName: string
  activeTab: 'Properties' | 'Editor'
  type?: SkillAvailabilityType
  isOpen?: boolean
}

const triggerSkillSidePanel = ({
  skill,
  distName,
  type,
  activeTab,
  isOpen,
}: Props): void => {
  const triggerByName = (displayName: string) => {
    switch (displayName) {
      case 'Dff Intent Responder Skill':
        trigger(TRIGGER_RIGHT_SP_EVENT, {
          isOpen,
          children: (
            <IntentResponderSidePanel
              key={skill.component_id + activeTab}
              skill={skill}
              activeTab={activeTab}
            />
          ),
        })
        break

      default:
        trigger(TRIGGER_RIGHT_SP_EVENT, {
          isOpen,
          children: (
            <SkillSidePanel
              key={skill.component_id + activeTab}
              component_id={skill?.component_id}
              distName={distName}
              activeTab={activeTab}
            />
          ),
        })
        break
    }
  }

  if (type === 'public') return triggerByName(skill.display_name!)

  switch (skill?.name?.includes('prompted')) {
    case true:
      trigger(TRIGGER_RIGHT_SP_EVENT, {
        isOpen,
        children: (
          <GenerativeSkillEditor
            key={skill.component_id + activeTab}
            component_id={skill?.component_id}
            distName={distName}
            activeTab={activeTab}
          />
        ),
      })
      break

    default:
      triggerByName(skill.display_name!)
      break
  }
}

export default triggerSkillSidePanel
