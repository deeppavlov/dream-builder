import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { SkillInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './SkillPromptModal.module.scss'

const mockSkillModels = ['ChatGPT', 'GPT-3', 'GPT-J', 'Bloom']

interface Props {
  skill?: SkillInfoInterface
  isEditingModal?: boolean
}

const SkillPromptModal = () => {
  let cx = classNames.bind(s)
  const [isOpen, setIsOpen] = useState(false)
  const [skill, setSkill] = useState<SkillInfoInterface | null>(null)
  const [skillModel, setSkillModel] = useState<string | null>(null)
  const [skillPrompt, setSkillPrompt] = useState<string | null>(null)
  const [isEditingModal, setIsEditingModal] = useState(false)
  const isHaveSkillName = skill?.name !== undefined && skill.name !== ''
  const isHaveModelAndPrompt = skillModel !== null && skillPrompt !== null

  const closeModal = () => {
    setIsOpen(false)
    setSkillModel(null)
    setSkillPrompt(null)
  }

  const handleBackBtnClick = () => closeModal()
  const handleCancelBtnClick = () => closeModal()

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = (data: { detail: Props }) => {
    const { skill, isEditingModal } = data.detail

    setSkill(skill?.name ? skill : null)
    setSkillModel(skill?.model ? skill.model : null)
    setSkillPrompt(skill?.prompt ? skill.prompt : null)
    setIsEditingModal(Boolean(isEditingModal))
    setIsOpen(!isOpen)
  }

  const handleModelSelect = (model: string) => setSkillModel(model)

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setSkillPrompt(isValue ? value : null)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newSkill = { ...skill, ...{ name: value } } as SkillInfoInterface
    setSkill(newSkill)
    console.log(newSkill, isHaveSkillName)
  }

  const handleSaveBtnClick = () => {
    const newSkill = {
      ...skill,
      ...{ model: skillModel, prompt: skillPrompt },
    }

    // isEditing
    if (isEditingModal) {
      // update here edited skill
      closeModal()
      return
    }

    // isCreating
    if (!isHaveModelAndPrompt) return
    trigger('CreateSkillDistModal', newSkill)
    closeModal()
  }

  useEffect(() => {
    subscribe('SkillPromptModal', handleEventUpdate)
    return () => unsubscribe('SkillPromptModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={cx('skillPromptModal')}>
        {!isEditingModal && (
          <h4>{skill?.display_name || skill?.name || 'Skill name'}</h4>
        )}
        {!isEditingModal ? (
          <SkillDropboxSearch
            placeholder='Choose model'
            list={mockSkillModels}
            activeItem={skill?.model}
            onSelect={handleModelSelect}
          />
        ) : (
          <Input
            label={'You can change name here'}
            props={{
              placeholder: 'You can change name here',
              value: skill?.display_name || skill?.name || '',
            }}
            onChange={handleNameChange}
          />
        )}
        <TextArea
          label='Enter prompt:'
          props={{
            placeholder:
              "Hello, I'm a SpaceX Starman made by brilliant engineering team at SpaceX to tell you about the future of humanity in space and",
            value: skillPrompt || '',
          }}
          onChange={handlePromptChange}
        />
        <div className={cx('btns')}>
          <Button
            theme='secondary'
            props={{
              onClick: isEditingModal
                ? handleCancelBtnClick
                : handleBackBtnClick,
            }}>
            {isEditingModal ? 'Cancel' : 'Back'}
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: isEditingModal
                ? !isHaveSkillName
                : !isHaveModelAndPrompt,
              onClick: handleSaveBtnClick,
            }}>
            Save
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}

export default SkillPromptModal
