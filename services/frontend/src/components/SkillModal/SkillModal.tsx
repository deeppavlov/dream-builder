import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SkillInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import s from './SkillModal.module.scss'

type TSkillModalAction = 'create' | 'copy' | 'edit'

interface ISkilltInfo
  extends Pick<SkillInfoInterface, 'display_name' | 'name' | 'desc'> {}

interface IParentSkillInfo
  extends Pick<SkillInfoInterface, 'display_name' | 'name'> {}

interface SkillModalProps {
  action: TSkillModalAction
  skill?: Partial<ISkilltInfo>
  parent?: IParentSkillInfo // The skill that we copy
}

export const SkillModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TSkillModalAction | null>(null)
  const [skill, setSkill] = useState<Partial<ISkilltInfo> | null>(null)
  const [parent, setParent] = useState<IParentSkillInfo | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'all' })
  const [NAME_ID, DESC_ID] = ['display_name', 'description']

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
    setParent(null)
  }

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = ({
    detail: { action, skill, parent },
  }: {
    detail: SkillModalProps
  }) => {
    setAction(action ?? 'create')
    setSkill(skill ?? null)
    setParent(parent ?? null)
    // Reset values and errors states
    reset({
      [NAME_ID]: skill?.display_name,
      [DESC_ID]: skill?.desc,
    })
    setIsOpen(!isOpen)
  }

  const handleCreate = (data: any) => {
    trigger('SkillPromptModal', {
      action: 'create',
      skill: {
        ...skill,
        ...{ display_name: data[NAME_ID], desc: data[DESC_ID] },
      },
    })
    closeModal()
  }

  const handleCopy = () => {}

  const handleEdit = () => {}

  const onFormSubmit = (data: any) => {
    if (action === 'create') {
      handleCreate(data)
      return
    }
  }

  useEffect(() => {
    subscribe('SkillModal', handleEventUpdate)
    return () => unsubscribe('SkillModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.skillModal}>
        <div>
          {action === 'create' && <h4>Create a new generative skill</h4>}
          {action === 'copy' && <h4>Create a new copy of a skill</h4>}
          {action === 'edit' && <h4>Edit skill</h4>}
          <div className={s.distribution}>
            {action === 'create' && (
              <div>
                You are creating a skill that uses{' '}
                <mark>large language models</mark>
              </div>
            )}
            {action === 'copy' && (
              <div>
                You are creating a copy of a skill from{' '}
                <mark>{parent?.display_name}</mark>
              </div>
            )}
            {action === 'edit' && (
              <div>
                You are editing <mark>{skill?.display_name}</mark> skill
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Input
            label='Name'
            error={errors[NAME_ID]}
            props={{
              placeholder: 'Enter name of your skill',
              value: getValues()[NAME_ID],
              ...register(NAME_ID, {
                required: 'Please add name for your skill',
              }),
            }}
          />

          <TextArea
            label='Description'
            withCounter
            error={errors[DESC_ID]}
            about={
              <div className={s['muted-text']}>
                You will be able to edit this information later.
              </div>
            }
            props={{
              placeholder: 'Enter description for your skill',
              value: getValues()[DESC_ID],
              ...register(DESC_ID, {
                required: 'Please add description for your skill.',
                maxLength: {
                  value: 500,
                  message: 'You’ve reached limit of the signs.',
                },
              }),
            }}
          />
          <div className={s.btns}>
            <Button theme='secondary' props={{ onClick: closeModal }}>
              Cancel
            </Button>
            <Button theme='primary' props={{ type: 'submit' }}>
              {action === 'edit' ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
