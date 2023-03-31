import { TRIGGER_RIGHT_SP_EVENT } from '../components/BaseSidePanel/BaseSidePanel'
import GenerativeSkillEditor from '../components/GenerativeSkillEditor/GenerativeSkillEditor'
import IntentResponderSidePanel from '../components/IntentResponderSidePanel/IntentResponderSidePanel'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'
import { ISkill, SkillAvailabilityType } from '../types/types'
import { trigger } from './events'

interface Props {
  skill: ISkill
  activeTab: 'Properties' | 'Editor'
  type?: SkillAvailabilityType
  parent?: React.MutableRefObject<any>
}

const triggerSkillSidePanel = ({
  skill,
  type,
  activeTab,
  parent,
}: Props): void => {
  const triggerByName = (displayName: string) => {
    switch (displayName) {
      case 'Dff Intent Responder Skill':
        trigger(TRIGGER_RIGHT_SP_EVENT, {
          parent,
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
        trigger(TRIGGER_RIGHT_SP_EVENT, {
          parent,
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

  switch (skill?.name?.includes('prompted')) {
    case true:
      trigger(TRIGGER_RIGHT_SP_EVENT, {
        parent,
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
