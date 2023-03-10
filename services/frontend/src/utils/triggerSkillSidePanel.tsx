import { BASE_SP_EVENT } from '../components/BaseSidePanel/BaseSidePanel'
import GenerativeSkillEditor from '../components/GenerativeSkillEditor/GenerativeSkillEditor'
import IntentResponderSidePanel from '../components/IntentResponderSidePanel/IntentResponderSidePanel'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'
import { SkillAvailabilityType, SkillInfoInterface } from '../types/types'
import { trigger } from './events'

interface Props {
  skill: SkillInfoInterface
  activeTab: 'Properties' | 'Editor'
  type?: SkillAvailabilityType
}

const triggerSkillSidePanel = ({ skill, type, activeTab }: Props): void => {
  const triggerByName = (displayName: string) => {
    switch (displayName) {
      case 'Dff Intent Responder Skill':
        trigger(BASE_SP_EVENT, {
          children: (
            <IntentResponderSidePanel
              key={displayName + activeTab}
              skill={skill}
              activeTab={activeTab}
            />
          ),
        })
        break

      default:
        trigger(BASE_SP_EVENT, {
          children: (
            <SkillSidePanel
              key={displayName + activeTab}
              skill={skill}
              activeTab={activeTab}
            />
          ),
        })
        break
    }
  }

  if (type === 'public') {
    triggerByName(skill.display_name!)
    return
  }

  switch (skill.skillType) {
    case 'generative':
      trigger(BASE_SP_EVENT, {
        children: (
          <GenerativeSkillEditor
            key={skill.display_name + activeTab}
            skill={skill}
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
