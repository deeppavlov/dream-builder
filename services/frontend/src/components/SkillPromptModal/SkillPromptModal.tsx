import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SkillInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './SkillPromptModal.module.scss'

const mockSkillModels = ['ChatGPT', 'GPT-3', 'GPT-J', 'Bloom']

type TAction = 'create' | 'edit'

interface Props {
  action?: TAction
  skill?: SkillInfoInterface
}

const SkillPromptModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)
  const [skill, setSkill] = useState<SkillInfoInterface | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'all' })
  const [NAME_ID, MODEL_ID, PROMPT_ID] = ['display_name', 'model', 'prompt']

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
  }

  const handleCancelBtnClick = () => closeModal()

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = (data: { detail: Props }) => {
    const { skill, action } = data.detail

    setAction(action ?? 'create')
    setSkill(skill ?? null)
    // Reset values and errors states
    reset({
      [MODEL_ID]: skill?.model,
      [PROMPT_ID]: skill?.prompt,
    })
    setIsOpen(!isOpen)
  }

  const handleModelSelect = (model: string) => {
    reset({
      [MODEL_ID]: model,
    })
  }

  const handleEdit = () => {}

  const handleCreate = (data: any) => {
    const newSkill = {
      ...skill,
      ...{ model: data[MODEL_ID], prompt: data[PROMPT_ID] },
    }
    trigger('CreateSkillDistModal', newSkill)
  }

  const onFormSubmit = (data: any) => {
    if (action === 'create') {
      handleCreate(data)
      return
    }
  }

  useEffect(() => {
    subscribe('SkillPromptModal', handleEventUpdate)
    return () => unsubscribe('SkillPromptModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form
        className={s.skillPromptModal}
        onSubmit={handleSubmit(onFormSubmit)}>
        {action === 'create' && (
          <>
            <h4>{skill?.display_name || 'Skill name'}</h4>
            <SkillDropboxSearch
              list={mockSkillModels}
              activeItem={skill?.model}
              error={errors[MODEL_ID]}
              props={{
                placeholder: 'Choose model',
                ...register(MODEL_ID, { required: true }),
              }}
              onSelect={handleModelSelect}
            />
          </>
        )}
        {action === 'edit' && (
          <Input
            label='Name'
            error={errors[NAME_ID]}
            props={{
              placeholder: 'You can change name here',
              value: getValues()[NAME_ID],
              ...register(NAME_ID, {
                required: 'Please add name for your skill',
              }),
            }}
          />
        )}
        <TextArea
          label='Enter prompt:'
          withCounter
          error={errors[PROMPT_ID]}
          props={{
            placeholder:
              "Hello, I'm a SpaceX Starman made by brilliant engineering team at SpaceX to tell you about the future of humanity in space and",
            value: getValues()[PROMPT_ID],
            ...register(PROMPT_ID, {
              required: 'Please write promt before you continue next step',
              maxLength: {
                value: 500,
                message: 'You’ve reached limit of the signs.',
              },
            }),
          }}
        />
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleCancelBtnClick }}>
            {action === 'edit' ? 'Cancel' : 'Back'}
          </Button>
          <Button theme='primary' props={{ type: 'submit' }}>
            Save
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}

export default SkillPromptModal
