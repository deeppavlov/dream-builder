import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { SkillInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './SkillPromptModal.module.scss'

const mockSkillModels = ['Chit-Chat GPT', 'GPT-3', 'GPT-J', 'Bloom']

const SkillPromptModal = () => {
  let cx = classNames.bind(s)
  const [isOpen, setIsOpen] = useState(false)
  const [skill, setSkill] = useState<SkillInfoInterface | null>(null)
  const [skillModel, setSkillModel] = useState<string | null>(null)
  const [skillPrompt, setSkillPrompt] = useState<string | null>(null)
  const isHaveModelAndPrompt = skillModel !== null && skillPrompt !== null

  const handleBackBtnClick = () => {
    setIsOpen(false)
    setSkillModel(null)
    setSkillPrompt(null)
    // open previos modal here
  }

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = (data: { detail: SkillInfoInterface }) => {
    const { detail } = data
    setSkill(detail?.name ? detail : null)
    setIsOpen(!isOpen)
  }

  const handleModelSelect = (model: string) => setSkillModel(model)

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setSkillPrompt(isValue ? value : null)
  }

  const handleSaveBtnClick = () => {
    if (!isHaveModelAndPrompt) return
    // open next modal here
  }

  useEffect(() => {
    subscribe('SkillPromptModal', handleEventUpdate)
    return () => unsubscribe('SkillPromptModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={cx('skillPromptModal')}>
        <h4>{skill?.name || 'Skill name'}</h4>
        <SkillDropboxSearch
          placeholder='Choose model'
          list={mockSkillModels}
          onSelect={handleModelSelect}
        />
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
          <Button theme='secondary' props={{ onClick: handleBackBtnClick }}>
            Back
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: !isHaveModelAndPrompt,
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
