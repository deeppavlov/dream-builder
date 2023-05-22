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
  visibility?: SkillAvailabilityType
  isOpen?: boolean
}

const triggerSkillSidePanel = ({
  skill,
  distName,
  visibility,
  activeTab,
  isOpen,
}: Props): void => {
  const component_id = skill?.component_id ?? skill?.id
  const key = `${component_id}_${visibility}_${activeTab}`

  const triggerByName = (displayName: string) => {
    switch (displayName) {
      case 'Dff Intent Responder Skill':
        trigger(TRIGGER_RIGHT_SP_EVENT, {
          isOpen,
          children: (
            <IntentResponderSidePanel
              key={key}
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
              key={key}
              component_id={component_id}
              distName={distName}
              visibility={visibility}
              activeTab={activeTab}
            />
          ),
        })
        break
    }
  }

  // if (visibility === 'public') return triggerByName(skill.display_name!)

  switch (skill?.name?.includes('prompted')) {
    case true:
      trigger(TRIGGER_RIGHT_SP_EVENT, {
        isOpen,
        children: (
          <GenerativeSkillEditor
            key={key}
            component_id={component_id}
            distName={distName}
            visibility={visibility}
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
