import { ReactComponent as AlertIcon } from '@assets/icons/read_first_alert.svg'
import { ISkill, SkillAvailabilityType } from '../../types/types'
import Button from '../../ui/Button/Button'
import { trigger } from '../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { EditablePlaceholder } from '../EditablePlaceholder/EditablePlaceholder'
import ReadFirstSidePanel from '../ReadFirstSidepanel/ReadFisrstSidePanel'

interface IProps {
  value: string
  distName: string
  activeTab: 'Properties' | 'Editor'
  visibility?: SkillAvailabilityType
  skill?: ISkill
}

const SkillTaskPlaceholder = ({
  skill,
  value,
  distName,
  activeTab,
  visibility,
}: IProps) => {
  const handleSave = (skillTask: string) => {}

  const handleReadFirstClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: true,
      children: (
        <ReadFirstSidePanel
          skill={skill}
          distName={distName}
          activeTab={activeTab}
          visibility={visibility}
        />
      ),
    })
  }
  return (
    <EditablePlaceholder
      label='Skill task:'
      value={value}
      handleSave={handleSave}
      rules={{
        required: true,
        maxLength: {
          value: 500,
          message: '',
        },
      }}
      disabled={visibility !== 'your'}
      buttons={
        <Button
          theme='tertiary-round'
          small
          props={{ onClick: handleReadFirstClick }}
        >
          <AlertIcon />
          Read First
        </Button>
      }
    />
  )
}

export default SkillTaskPlaceholder