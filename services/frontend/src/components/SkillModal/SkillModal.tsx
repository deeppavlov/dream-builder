import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useComponent } from '../../hooks/useComponent'
import { useObserver } from '../../hooks/useObserver'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { validationSchema } from '../../utils/validationSchema'
import s from './SkillModal.module.scss'

type TSkillModalAction = 'create' | 'copy' | 'edit'

interface IParentSkillInfo extends Pick<ISkill, 'display_name' | 'name'> {}

interface SkillModalProps {
  action: TSkillModalAction
  skill?: ISkill
  parent?: IParentSkillInfo // The skill that we copy
}

export const SkillModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TSkillModalAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const { name: distName } = useParams()
  const [NAME_ID, DESC_ID] = ['display_name', 'description']

  const { handleSubmit, control, reset, getValues } = useForm({ mode: 'all' })

  const descriptionMaxLenght = 500

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
  }

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = ({
    detail: { action, skill },
  }: {
    detail: SkillModalProps
  }) => {
    setAction(action ?? 'create')
    setSkill(skill ?? null)

    // Reset values and errors states
    reset({
      [NAME_ID]: skill?.display_name,
      [DESC_ID]: skill?.description,
    })
    setIsOpen(prev => !prev)
  }
  const { create, edit } = useComponent()

  const handleCreate = (data: any) => {
    toast.promise(
      create.mutateAsync(
        { data, distName: distName || '', type: 'skills' },
        { onSuccess: closeModal }
      ),
      {
        loading: 'Creating...',
        success: 'Success!',
        error: 'Something went wrong...',
      }
    )
  }
  const handleEdit = (data: { display_name: string; description: string }) => {
    const isDist = distName && distName?.length > 0

    if (!skill) return
    if (!isDist) return console.log(`${skill?.name} rename: dist not found.`)

    const { component_id } = skill

    toast
      .promise(
        edit.mutateAsync({ data, component_id, distName, type: 'skills' }),
        {
          loading: 'Renaming...',
          success: 'Success!',
          error: 'Something went wrong...',
        }
      )
      .then(() => closeModal())
  }
  const onFormSubmit = (data: any) => {
    action === 'create' && handleCreate(data)
    action === 'edit' && handleEdit(data)
  }

  useObserver('SkillModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.skillModal}>
        <div>
          {action == 'create' && <h4>Create a new generative skill</h4>}
          {action == 'edit' && <h4>Rename skill</h4>}
          <div className={s.distribution}>
            {action == 'create' && (
              <div>
                You are creating a skill that uses{' '}
                <mark>large language models</mark>
              </div>
            )}
            {action == 'edit' && (
              <div>
                You are renaming: <mark>{skill?.display_name}</mark>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Input
            label='Name'
            name={NAME_ID}
            defaultValue={getValues()[NAME_ID]}
            control={control}
            rules={{
              required: validationSchema.global.required,
              pattern: validationSchema.global.regExpPattern,
            }}
            props={{
              placeholder:
                'A short name describing your Virtual Assistant’s skill',
            }}
          />

          <TextArea
            name={DESC_ID}
            control={control}
            label='Description'
            defaultValue={getValues()[DESC_ID]}
            withCounter
            rules={{
              required: validationSchema.global.required,
              maxLength:
                validationSchema.global.desc.maxLength(descriptionMaxLenght),
              pattern: validationSchema.global.regExpPattern,
            }}
            props={{
              placeholder:
                'Describe your Virtual Assistant’s skill ability, where you can use it and for what purpose',
              rows: 6,
            }}
          />
          <div className={s.btns}>
            <Button theme='secondary' props={{ onClick: closeModal }}>
              Cancel
            </Button>
            <Button theme='primary' props={{ type: 'submit' }}>
              {action == 'create' && 'Create'}
              {action == 'edit' && 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
