import { AddSkillModal } from '../components/ModalWindows/AddSkillModal'
import { CreateAssistantModal } from '../components/ModalWindows/CreateAssistantModal'
import { EditModal } from '../components/ModalWindows/EditModal'
import { CheckBox } from '../ui/Checkbox/Checkbox'

export const TestPage = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightgray',
      height: '100%',
      gap: '40px',
    }}>
    <CreateAssistantModal>Create Assistant</CreateAssistantModal>
    <AddSkillModal>Add Skill</AddSkillModal>
    <EditModal>Edit Bot Description</EditModal>
    <CheckBox />
  </div>
)
